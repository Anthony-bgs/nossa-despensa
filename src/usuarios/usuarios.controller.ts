import { BadRequestException, Body, Controller, Post, UseFilters, UseGuards } from '@nestjs/common';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { UsuariosService } from './usuarios.service';
import type { UsuarioDto } from './usuario.dto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('usuarios')
@UseFilters(new HttpExceptionFilter())
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) { }

  @Post('/')
  async novoUsuario(@Body() dados: UsuarioDto): Promise<string | void> {
    try {
      return await this.usuariosService.novoUsuario(dados);
    } catch (error: any) {
      console.error('Erro ao criar usuário:', error);
      throw new BadRequestException(error.message);
    }
  }
}
