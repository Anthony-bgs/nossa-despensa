import { Categoria, Grandeza, LocalArmazenamento, StatusProduto } from "src/helper/produto";
import { Imagem } from "src/imagens/imagem.interface";
import { Lote } from "src/lotes/lote.interface";

export interface Produto {
    nome: string;
    marca: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    codigoBarras: string;
    localArmazenamento: LocalArmazenamento;
    status: StatusProduto
    estoqueTotal: number;   
    lotes: Lote[];
    images: Imagem[];
    _id: string;                                                                
}

