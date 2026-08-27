import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioLogin } from './usuarios.interface';
import { SALT_OR_ROUNDS } from '../Helper/constantes';
import { supabase } from '../utils/supabase';
import type { UsuarioDto } from './usuario.dto';
import { decryptData, encryptData } from '../crypto/crypto';

@Injectable()
export class UsuariosService {
  constructor() { }

  async criar(dados: UsuarioDto): Promise<boolean> {
    const emailExiste = await this.buscarPorEmail(dados.email);
    if (emailExiste) {
      throw new ConflictException('E-mail já cadastrado');
    }
    const senhaHash = await this.criptografarSenha(dados.senha);
    if (dados.cpf) {
      const cpfCriptografado = await encryptData(dados.cpf);
      dados.cpf = cpfCriptografado;
    }

    const usuario = await supabase
      .from('usuarios')
      .insert({
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        cpf: dados.cpf,
        foto: dados.foto,
        telefone: dados.telefone,
      })
      .single();


    if (usuario.error) {
      throw usuario.error;
    }
    return true;
  }

  async login(email: string, senha: string): Promise<UsuarioLogin | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return null;
    }

    const senhaValida = await this.compararSenhas(senha, data.senha);
    if (!senhaValida) {
      
      return null;
    }

    return {
      id: data.id,
      email: data.email,
    };
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
    };
  }

  async buscarPorId(id: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }
    const cpfDescriptografado = data.cpf ? await decryptData(data.cpf) : undefined;

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      telefone: data.telefone,
      foto: data.foto,
      cpf: cpfDescriptografado,
    };
  }

  async criptografarSenha(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, parseInt(SALT_OR_ROUNDS!));
    return hash;
  }

  async compararSenhas(senhaTentativa: string, senhaUsuario: string): Promise<boolean> {
    return await bcrypt.compare(senhaTentativa, senhaUsuario);
  }

  async existePorId(id: number): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', id)
      .maybeSingle();
      if ( data && data.id === id) {
        return true;
      }
      return false;
  }
  async deletar(id: number): Promise<void> {
    const { error } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);
    if (error) {
      throw error;
    }
  }
}
