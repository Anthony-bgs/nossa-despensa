import { Body, Controller, Delete, Get, HttpCode, Logger, Post, Put, Request, UseFilters, UseGuards } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import type { UsuarioDto } from './usuario.dto';
import type { Usuario, UsuarioToken } from './usuario.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';


@Controller('usuarios')
@UseFilters(new HttpExceptionFilter())
export class UsuariosController {
	constructor(private readonly usuarioService: UsuariosService) { }

	@HttpCode(201)
	@Post()
	async criar(@Body() dados: UsuarioDto): Promise<void> {
		try {
			await this.usuarioService.criar(dados);
		} catch (error) {
			throw error;
		}
	}

	@Get("/perfil")
	@UseGuards(AuthGuard)
	async buscarPorId(@Request() req: UsuarioToken): Promise<Usuario> {
		try {
			return await this.usuarioService.buscarPorId(req.usuario.id);
		} catch (error) {
			throw error;
		}
	}

	@Put("/perfil/atualizar")
	@UseGuards(AuthGuard)
	async atualizar(@Request() req: UsuarioToken, @Body() dados: UsuarioDto): Promise<Usuario> {
		try {
			return await this.usuarioService.atualizar(req.usuario.id, dados);
		} catch (error) {
			throw error;
		}
	}

	@Delete("deletar")
	@UseGuards(AuthGuard)
	async deletar(@Request() req: UsuarioToken): Promise<void> {
		try {
			await this.usuarioService.deletar(req.usuario.id);
		} catch (error) {
			throw error;
		}
	}
}