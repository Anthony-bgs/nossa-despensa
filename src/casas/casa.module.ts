import { forwardRef, Module } from '@nestjs/common';
import { CasaService } from './casa.service';
import { CasaController } from './casa.controller';
import { MembroCasaModule } from '../membros_casa/membro_casa.module';
import { ProdutoService } from '../produtos/produto.service';
import { LocalArmazenamentoService } from '../locais-armazenamento/local-armazenamento.service';
import { DespensaService } from '../despensas/despensa.service';
import { ProdutoDespensaService } from '../produtos-despensa/produto-despensa.service';

@Module({
  imports: [forwardRef(() => MembroCasaModule)],
  controllers: [CasaController],
  providers: [CasaService, ProdutoService, DespensaService, LocalArmazenamentoService, ProdutoDespensaService],
  exports: [CasaService],
})
export class CasaModule { }
