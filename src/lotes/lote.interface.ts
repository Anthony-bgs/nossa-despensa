export interface Lote {
    validade: Date;
    quantidade: number;
    produto: string;
    statusValidade: StatusValidade;
    status: Status;
    _id?: string;
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