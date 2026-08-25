import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import type { UsuarioDto } from './usuario.dto';
import type { Usuario } from './usuarios.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('usuarios')
@UseFilters(new HttpExceptionFilter())
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @HttpCode(201)
  @Post()
  async criar(@Body() dados: UsuarioDto): Promise<void> {
    try {
    await this.usuariosService.criar(dados);
    } catch (error) {
      throw error;
    }
  }

  @UseGuards(AuthGuard)
  @Get("eu")
  async buscarPorId(@Request() req: any): Promise<Usuario> {
    try {
    const usuario = await this.usuariosService.buscarPorId(req?.usuario?.sub);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }
    return usuario;
    } catch (error) {
      throw error;
    }
   
  }
}
