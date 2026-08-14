
export interface Produto {
    id: number;
    nome: string;
    marca: string;
    categoria?: Categoria | string | null;
    grandeza?: Grandeza | string | null;
    tamanhoPadrao?: number | null;
    codigoBarras?: string | null;
    localArmazenamento?: LocalArmazenamento | string | null;
    status?: Status | string | null;
    estoqueTotal?: number | null;
    criado_em?: string | Date | null;
    _id?: string;
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
    UN = 'UN',
    KG = 'KG',
    L = 'L',
    G = 'G',
    ML = 'ML',
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
    totalProdutos: number;
    produtos: Produto[];
    paginacao: {
        total: number;
    };
}