import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioLogin } from './usuarios.interface';
import { SALT_OR_ROUNDS } from '../Helper/constantes';
import { supabase } from '../utils/supabase';
import type { UsuarioDto } from './usuario.dto';

@Injectable()
export class UsuariosService {
  constructor() { }

  async criar(dados: UsuarioDto): Promise<boolean> {
    const emailExiste = await this.buscarPorEmail(dados.email);
    if (emailExiste) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await this.criptografarSenha(dados.senha);

    const usuario = await supabase
      .from('usuarios')
      .insert({
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
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
      senha: data.senha,
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

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
      senha: data.senha,
    };
  }

  async criptografarSenha(senha: string): Promise<string> {
    const hash = await bcrypt.hash(senha, parseInt(SALT_OR_ROUNDS!));
    return hash;
  }

  async compararSenhas(senhaTentativa: string, senhaUsuario: string): Promise<boolean> {
    return await bcrypt.compare(senhaTentativa, senhaUsuario);
  }

  async existePorId(id: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    return !error && !!data;
  }
}
