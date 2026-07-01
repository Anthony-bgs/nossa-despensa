import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ProdutoModule } from './produtos/produto.module';
import { LoteModule } from './lotes/lote.module';
import { APP_FILTER } from '@nestjs/core/constants';
import { HttpExceptionFilter } from './filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    MongooseModule.forRoot(process.env.MONGO_URI ?? 'mongodb://localhost:27017/nossa-depensa'),
    ProdutoModule,
    LoteModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    }
  ],
})
export class AppModule {}
