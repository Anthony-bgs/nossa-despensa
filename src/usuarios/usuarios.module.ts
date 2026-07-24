import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { MongooseModule } from '@nestjs/mongoose';

import { UsuarioSchema } from './usuarios.schema';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Usuario', schema: UsuarioSchema }]),
  ],
  controllers: [],
  providers: [UsuariosService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
