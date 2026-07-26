import { Model } from 'mongoose';
import { Lote, StatusValidade } from './lote.interface';
import { ProdutoService } from '../produtos/produto.service';
import { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
export declare class LoteService {
    private loteModel;
    private readonly produtoService;
    constructor(loteModel: Model<Lote>, produtoService: ProdutoService);
    adicionarLote(dados: AdicionarLoteDTO, produtoId: string): Promise<Lote>;
    atualizarLote(dados: AtualizarLoteDTO, produtoId: string, loteId: string): Promise<void>;
    deletarLote(loteId: string): Promise<void>;
    buscarLotePorId(loteId: string): Promise<Lote | null>;
    deletarLotePorProduto(produtoId: string): Promise<void>;
    calcularEstoqueTotalDosLotesPorProdutoId(produtoId: string): Promise<number>;
    calcularStatusValidade(validade: Date): StatusValidade;
}
