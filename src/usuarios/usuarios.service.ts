import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario } from './usuarios.interface';
import { UsuarioDto } from './usuario.dto';
import { SALT_OR_ROUNDS } from '../Helper/constantes';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel('Usuario') private usuarioModel: Model<Usuario>,
  ) { }

  async login(email: string, senha: string): Promise<Usuario | null> {
    let senhaValida = false;
    const usuario = await this.usuarioModel.findOne({ email }).exec();
    if (!usuario) {
      return null;
    }

    senhaValida = await this.compararSenhas(senha, usuario.senha);

    return senhaValida ? usuario : null;
  }

  async novoUsuario(body: UsuarioDto): Promise<void> {
    const { nome, email, senha } = body;
    const hashedPassword = await this.criptografarSenha(senha);
    const newUser = new this.usuarioModel({ nome, email, senha: hashedPassword });
    await newUser.save();
  }

  async criptografarSenha(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, parseInt(SALT_OR_ROUNDS!));
    return hash;
  }

  async compararSenhas(senhaTentativa: string, senhaUsuario: string): Promise<boolean> {
    return await bcrypt.compare(senhaTentativa, senhaUsuario);
  }

}
