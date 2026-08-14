import { Categoria, Grandeza, LocalArmazenamento } from './produto.interface';

export interface NovoProdutoDTO {
    nome: string;
    marca: string;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    codigoBarras: string;
    localArmazenamento: LocalArmazenamento;
}

export interface AtualizarProdutoDTO {
    nome?: string;
    marca?: string;
    categoria?: Categoria;
    grandeza?: Grandeza;
    tamanhoPadrao?: number;
    codigoBarras?: string;
    localArmazenamento?: LocalArmazenamento;
}

export interface FiltroDTO {
    nome?: string;
    codigoBarras?: string;
}