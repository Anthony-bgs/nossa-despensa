import { forwardRef, Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { ProdutoModule } from '../produtos/produto.module';

@Module({
  imports: [
    forwardRef(() => ProdutoModule),
  ],
  controllers: [LoteController],
  providers: [LoteService],
  exports: [LoteService],
})
export class LoteModule {}
