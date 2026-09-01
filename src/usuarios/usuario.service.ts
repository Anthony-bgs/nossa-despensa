import { Injectable, ConflictException, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { Mensagens } from '../Helper/mensagens';
import * as bcrypt from 'bcrypt';
import { Usuario, UsuarioLogin } from './usuario.interface';
import { SALT_OR_ROUNDS } from '../Helper/constantes';
import { supabase } from '../utils/supabase';
import type { UsuarioAtualizarDto, UsuarioDto } from './usuario.dto';
import { UsuarioSchema } from './usuario.schema';

@Injectable()
export class UsuariosService {
	constructor() { }

	async criar(dados: UsuarioDto): Promise<void> {
		// if (dados.cpf) {
		// 	const cpfCriptografado = await encryptData(dados.cpf);
		// 	dados.cpf = cpfCriptografado;
		// }

		const usuario = await supabase
			.from('usuarios')
			.insert({
				nome: dados.nome,
				email: dados.email,
				senha: await this.criptografarSenha(dados.senha),
				cpf: dados.cpf,
				foto: dados.foto,
				telefone: dados.telefone,
			})
			.single();


		if (usuario.error) {
			Logger.error(usuario.error);
			if (usuario.error.code === '23505' && usuario.error.details?.includes('email')) {
				throw new ConflictException(Mensagens.EMAIL_JA_CADASTRADO);
			}
			if (usuario.error.code === '23505' && usuario.error.details?.includes('cpf')) {
				throw new ConflictException(Mensagens.CPF_JA_CADASTRADO);
			}
			throw new BadRequestException(Mensagens.DADOS_INVALIDOS);
		}
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

	async buscarPorId(usuarioId: number): Promise<Usuario> {
		const { data, error } = await supabase
			.from('usuarios')
			.select('*')
			.eq('id', usuarioId)
			.single<UsuarioSchema>();

		if (error || !data) {
			Logger.debug(error);
			throw new NotFoundException(Mensagens.USUARIO_NAO_ENCONTRADO);
		}

		// const cpfDescriptografado = data.cpf ? await decryptData(data.cpf) : undefined;

		return this.mapUsuarioSchemaToUsuario(data);
	}

	async existePorId(id: number): Promise<boolean> {
		const { data, error } = await supabase
			.from('usuarios')
			.select('id')
			.eq('id', id)
			.maybeSingle<UsuarioSchema>();
		if (data && data.id === id) {
			return true;
		}
		return false;
	}

	async atualizar(usuarioId: number, dados: UsuarioAtualizarDto): Promise<Usuario> {
		const payload: Partial<UsuarioSchema> = {
			atualizado_em: new Date(),
			cpf: dados.cpf ?? undefined,
			foto: dados.foto ?? undefined,
			telefone: dados.telefone ?? undefined,
			nome: dados.nome ?? undefined,
			email: dados.email ?? undefined,
			senha: dados.senha ? await this.criptografarSenha(dados.senha) : undefined
		};

		const { data, error } = await supabase
			.from('usuarios')
			.update(payload)
			.select('*')
			.eq('id', usuarioId)
			.single<UsuarioSchema>();
		if (error) {
			Logger.error(error);
			throw new BadRequestException(Mensagens.ERRO_INTERNO);
		}
		return this.mapUsuarioSchemaToUsuario(data);
	}

	async deletar(usuarioId: number): Promise<void> {
		const { error } = await supabase
			.from('usuarios')
			.delete()
			.eq('id', usuarioId);
		if (error) {
			Logger.error(error);
			throw new BadRequestException(Mensagens.ERRO_INTERNO);
		}
	}

	async criarOuBuscarPorGoogle(dados: { email: string; nome: string; foto?: string }): Promise<UsuarioLogin> {
		const usuarioExistente = await this.buscarPorEmail(dados.email);
		if (usuarioExistente) {
			return {
				id: Number(usuarioExistente.id),
				email: usuarioExistente.email,
			};
		}

		const senhaPadrao = process.env.GOOGLE_DEFAULT_PASSWORD ?? 'google-user-default-password';
		const senhaHash = await this.criptografarSenha(senhaPadrao);

		const { data, error } = await supabase
			.from('usuarios')
			.insert({
				nome: dados.nome,
				email: dados.email,
				senha: senhaHash,
				foto: dados.foto,
				telefone: null,
			})
			.select('id, email')
			.single();

		if (error || !data) {
			throw error ?? new Error('Erro ao criar usuário via Google');
		}

		return {
			id: Number(data.id),
			email: data.email,
		};
	}

	private async criptografarSenha(senha: string): Promise<string> {
		const hash = await bcrypt.hash(senha, parseInt(SALT_OR_ROUNDS!));
		return hash;
	}

	private async compararSenhas(senhaTentativa: string, senhaUsuario: string): Promise<boolean> {
		return await bcrypt.compare(senhaTentativa, senhaUsuario);
	}

	private mapUsuarioSchemaToUsuario(usuarioSchema: UsuarioSchema): Usuario {
		return {
			id: usuarioSchema.id,
			nome: usuarioSchema.nome,
			email: usuarioSchema.email,
			telefone: usuarioSchema.telefone ?? undefined,
			foto: usuarioSchema.foto ?? undefined,
			cpf: usuarioSchema.cpf ?? undefined,
			criadoEm: new Date(usuarioSchema.criado_em).toLocaleString(),
			atualizadoEm: usuarioSchema.atualizado_em ? new Date(usuarioSchema.atualizado_em).toLocaleString() : undefined,
		};
	}

	private async buscarPorEmail(email: string): Promise<Usuario | null> {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .maybeSingle<UsuarioSchema>();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      nome: data.nome,
      email: data.email,
    };
  }
}