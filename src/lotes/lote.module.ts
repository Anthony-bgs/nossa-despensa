import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LoteSchema } from './lote.schema';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { ProdutoModule } from '../produtos/produto.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Lote', schema: LoteSchema }]),
    forwardRef(() => ProdutoModule),
  ],
  controllers: [LoteController],
  providers: [LoteService],
  exports: [LoteService],
})
export class LoteModule {}
