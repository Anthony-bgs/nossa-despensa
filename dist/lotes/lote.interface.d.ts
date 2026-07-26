export interface Lote {
    validade: Date;
    quantidade: number;
    produto: string;
    statusValidade: StatusValidade;
    status: Status;
    _id?: string;
}
export declare enum StatusValidade {
    VENCIDO = "VENCIDO",
    VENCENDO = "VENCENDO",
    VALIDO = "VALIDO"
}
export declare enum Status {
    ABERTO = "ABERTO",
    FECHADO = "FECHADO"
}
