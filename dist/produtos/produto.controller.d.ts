import { ProdutoService } from './produto.service';
import type { ListaDeProdutosInterface, Produto } from './produto.interface';
import type { AtualizarProdutoDTO, NovoProdutoDTO } from './produto.dto';
export declare class ProdutoController {
    private readonly produtoService;
    constructor(produtoService: ProdutoService);
    novoProduto(dados: NovoProdutoDTO): Promise<string>;
    buscarTodosProdutos(query?: Record<string, string>, request?: any): Promise<ListaDeProdutosInterface>;
    buscarProdutoPorId(id: string): Promise<Produto | string>;
    atualizarProduto(dados: AtualizarProdutoDTO, id: string): Promise<void>;
    deletarProduto(id: string): Promise<void>;
}
