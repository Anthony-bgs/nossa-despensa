import { Grandeza } from '../Helper/enum';
import { LocalArmazenamento } from './produto.interface';

export interface NovoProdutoDTO {
    nome: string;
    marca: string;
    unidade_medida: Grandeza;
    tamanhoPadrao: number;
    codigoBarras: string;
}

export interface AtualizarProdutoDTO {
    nome?: string;
    marca?: string;
    unidade_medida?: Grandeza;
    tamanhoPadrao?: number;
    codigoBarras?: string;
    localArmazenamento?: LocalArmazenamento;
}

export interface FiltroDTO {
    nome?: string;
    codigoBarras?: string;
    marca?: string;
}