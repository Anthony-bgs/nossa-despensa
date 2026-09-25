import { Module } from '@nestjs/common';
import { ProdutoDespensaController } from './produto-despensa.controller';
import { ProdutoDespensaService } from './produto-despensa.service';

@Module({
  controllers: [ProdutoDespensaController],
  providers: [ProdutoDespensaService],
  exports: [ProdutoDespensaService],
})
export class ProdutoDespensaModule {}
