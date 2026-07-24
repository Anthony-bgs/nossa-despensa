
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
    ALIMENTO = 'ALIMENTO',
    BEBIDA = 'BEBIDA',
    HIGIENE = 'HIGIENE',
    LIMPEZA = 'LIMPEZA',
    OUTROS = 'OUTROS',
    AUTO_CUIDADO = 'AUTO_CUIDADO',
}

export enum Grandeza {
    UNIDADE = 'UNIDADE',
    KILOGRAMA = 'KILOGRAMA',
    LITRO = 'LITRO',
    GRAMA = 'GRAMA',
    MILILITRO = 'MILILITRO',
}

export enum LocalArmazenamento {
    OUTRO = 'OUTRO',
    GELADEIRA = 'GELADEIRA',
    FREEZER = 'FREEZER',
    DESPENSA = 'DESPENSA',
    ARMARIO_PIA = 'ARMARIO_PIA',
    ARMARIO = 'ARMÁRIO',
    ARMARIO_PORTA_DIREITA_ENCIMA = 'ARMARIO_PORTA_DIREITA_ENCIMA',
    ARMARIO_PORTA_DIREITA_EMBAIXO = 'ARMARIO_PORTA_DIREITA_EMBAIXO',
    ARMARIO_CENTRAL = 'ARMARIO_CENTRAL',
    ARMARIO_GAVETA = 'ARMARIO_GAVETA',
    BANHEIRO = 'BANHEIRO',
    COMODA_COZINHA = 'COMODA_COZINHA',
    GUARDA_ROUPA = 'GUARDA_ROUPA',
}

export enum Status {
    EM_FALTA = 'EM_FALTA',
    EM_ESTOQUE = 'EM_ESTOQUE',
}

export interface ListaDeProdutosInterface {
    produtos: Produto[];
    paginacao: {
        total: number;
    };
}