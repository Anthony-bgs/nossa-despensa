import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import type { UsuarioDto } from './usuario.dto';
import type { Usuario } from './usuarios.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @HttpCode(201)
  @Post()
  async criar(@Body() dados: UsuarioDto): Promise<void> {
    await this.usuariosService.criar(dados);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async buscarPorId(@Param('id') id: string): Promise<Usuario> {
    const usuario = await this.usuariosService.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }
}
