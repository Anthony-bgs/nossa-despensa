import { Status, StatusValidade } from "./lote.interface";
export interface AdicionarLoteDTO {
    quantidade: number;
    validade: Date;
}
export interface AtualizarLoteDTO {
    quantidade: number;
    validade: Date;
    statusValidade: StatusValidade;
    status: Status;
}
