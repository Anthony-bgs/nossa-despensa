import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
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
  @Get("eu")
  async buscarPorId(@Request() req: any): Promise<Usuario> {
    const usuario = await this.usuariosService.buscarPorId(req?.usuario?.sub);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
  }
}
