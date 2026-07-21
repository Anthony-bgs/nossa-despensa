import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProdutoModule } from './produtos/produto.module';
import { LoteModule } from './lotes/lote.module';
import { APP_FILTER } from '@nestjs/core/constants';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { MONGO_URI } from './Helper/constantes';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URI),
    ProdutoModule,
    LoteModule,
    AuthModule,
    UsuariosModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule { }
