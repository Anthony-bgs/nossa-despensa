import { forwardRef, Module } from '@nestjs/common';
import { LoteService } from './lote.service';
import { LoteController } from './lote.controller';
import { ProdutoModule } from '../produtos/produto.module';
import { ProdutoDespensaModule } from '../produtos-despensa/produto-despensa.module';

@Module({
  imports: [
    forwardRef(() => ProdutoModule),
    forwardRef(() => ProdutoDespensaModule)
  ],
  controllers: [LoteController],
  providers: [LoteService],
  exports: [LoteService],
})
export class LoteModule {}
