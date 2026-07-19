
import { Imagem } from "../imagens/imagem.interface";
import { Lote } from "../lotes/lote.interface";

export interface Produto {
    nome: string;
    marca: string;
    categoria: Categoria;
    grandeza: Grandeza;
    tamanhoPadrao: number;
    codigoBarras: string;
    localArmazenamento: LocalArmazenamento;
    status: Status
    estoqueTotal: number;   
    lotes: Lote[];
    images: Imagem[];
    _id: string;                                                                
}

export enum Categoria {
    ALIMENTO = 'alimento',
    BEBIDA = 'bebida',
    HIGIENE = 'higiene',
    LIMPEZA = 'limpeza',
    OUTROS = 'outros'
}

export enum Grandeza {
    UNIDADE = 'unidade',
    KILOGRAMA = 'kg',
    LITRO = 'l',
    GRAMA = 'g',
    MILILITRO = 'ml',
}

export enum LocalArmazenamento {
    OUTRO = 'outro',
    GELADEIRA = 'geladeira',
    FREEZER = 'freezer',
    DESPENSA = 'despensa',
}                                  

export enum Status {
    EM_FALTA = 'em falta',
    EM_ESTOQUE = 'em estoque',
}

export interface ListaDeProdutosInterface {
    produtos: Produto[];
    paginacao: {
        total: number;
    };
}