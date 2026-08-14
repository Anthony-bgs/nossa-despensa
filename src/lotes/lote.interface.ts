export interface Lote {
    id: number;
    id_produto_despensa: number;
    quantidade: number;
    validade: Date | null;
    status: Status;
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