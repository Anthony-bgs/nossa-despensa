import { Module } from '@nestjs/common';
import { UsuariosService } from './usuario.service';
import { UsuariosController } from './usuario.controller';

@Module({
  imports: [],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
