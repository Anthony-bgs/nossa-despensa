import { Module } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ProdutoModule } from './produtos/produto.module';
import { LoteModule } from './lotes/lote.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DespensaModule } from './despensas/despensa.module';
import { CategoriaModule } from './categorias/categoria.module';
import { LocalArmazenamentoModule } from './locais-armazenamento/local-armazenamento.module';
import { ProdutoDespensaModule } from './produtos-despensa/produto-despensa.module';
import { HttpSuccessInterceptor } from './filters/http-success.filter';

@Module({
  imports: [
    ProdutoModule,
    LoteModule,
    AuthModule,
    UsuariosModule,
    DespensaModule,
    CategoriaModule,
    LocalArmazenamentoModule,
    ProdutoDespensaModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: HttpSuccessInterceptor,
    // },
  ],
})
export class AppModule { }
