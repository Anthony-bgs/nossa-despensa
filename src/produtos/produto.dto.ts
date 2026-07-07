import { Imagem } from "../imagens/imagem.interface";
import { Lote } from "../lotes/lote.interface";
import { Categoria, Grandeza, LocalArmazenamento } from "./produto.interface";


export interface NovoProdutoDTO {
    nome: string;
    marca: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    codigoBarras: string;
    localArmazenamento: LocalArmazenamento;
    estoqueTotal?: number;   
    lotes?: Lote[];
    images?: Imagem[];
}

export interface AtualizarProdutoDTO { 
    nome?: string;
    marca?: string;
    categoria?: Categoria;
    grandeza?: Grandeza;
    tamanhoPadrao?: number;
    codigoBarras?: string;
    localArmazenamento?: LocalArmazenamento;
    images?: Imagem[];
}
export interface FiltroDTO {
    nome?: string;
    categoria?: Categoria;
    codigoBarras?: string;
    filtroValidade?: number;  
    localArmazenamento?: LocalArmazenamento;                                                     
}