

export interface Lote {
    id: number;
    id_ass_produto_despensa: number;
    quantidade: number;
    validade_produto: string | null| Date;
    status_lote: Status;
    status_validade: StatusValidade;
    criado_em: string | Date;
}

export enum StatusValidade {
    VENCIDO = 'VENCIDO',
    VENCENDO = 'VENCENDO',
    VALIDO = 'VALIDO',
}

export enum Status {
    ABERTO = 'ABERTO',
    FECHADO = 'FECHADO',
}

export interface LoteSchema {
    id: number;
    id_ass_produto_despensa: number;
    quantidade: number;
    validade_produto: Date;
    status_lote: Status;
    status_validade: StatusValidade;
    criado_em: Date;
    atualizado_em:  Date;
}