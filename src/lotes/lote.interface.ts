export interface Lote {
    validade: Date;
    quantidade: number;
    produtoId: string;
    statusValidade: StatusValidade;
    status: Status;
    _id?: string;
}

export enum StatusValidade {
    VENCIDO = 'vencido',
    VENCENDO = 'vencendo',
    VALIDO = 'válido',
}

export enum Status {
    ABERTO = 'aberto',
    FECHADO = 'fechado',
}