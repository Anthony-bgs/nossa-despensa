import { ListaDeProdutosInterface, Produto } from './produto.interface';
import { Model } from 'mongoose';
import { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { LoteService } from '../lotes/lote.service';
import { Lote } from '../lotes/lote.interface';
import { PaginacaoDTO } from '../Helper/paginacaodto';
export declare class ProdutoService {
    private produtoModel;
    private readonly loteService;
    constructor(produtoModel: Model<Produto>, loteService: LoteService);
    novoProduto(dados: NovoProdutoDTO): Promise<string>;
    buscarTodosProdutos(filtro?: Partial<FiltroDTO>, paginacao?: PaginacaoDTO): Promise<ListaDeProdutosInterface>;
    buscarProdutoPorId(id: string): Promise<Produto | null>;
    adicionarLote(_id: string, lote: Lote, estoqueTotal: number): Promise<void>;
    atualizarProduto(_id: string, dados: AtualizarProdutoDTO): Promise<Produto | null>;
    deletarProduto(_id: string): Promise<Produto | null>;
    deletarLoteDoProduto(produtoId: string, loteId: string): Promise<void>;
    buscarProdutoParaEstoqueTotal(produtoId: string): Promise<Produto | null>;
    removerLote(produtoId: string, loteId: string, novoEstoqueTotal: number): Promise<void>;
    atualizarEstoqueTotal(produtoId: string, estoqueTotal: number): Promise<void>;
    private configurarPaginacao;
    private configurarPaginacaoResponse;
}
