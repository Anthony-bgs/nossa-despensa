import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsuarioSchema } from './usuarios.schema';
import { UsuariosController } from './usuarios.controller';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
