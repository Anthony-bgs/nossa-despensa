import { LoteService } from './lote.service';
import type { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
export declare class LoteController {
    private readonly loteService;
    constructor(loteService: LoteService);
    adicionarLote(dados: AdicionarLoteDTO, produtoId: string): Promise<string>;
    atualizarLote(dados: AtualizarLoteDTO, produtoId: string, loteId: string): Promise<void>;
    deletarLote(loteId: string): Promise<void>;
}
