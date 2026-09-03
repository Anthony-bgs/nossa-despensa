import { PapelMembroCasa, StatusMembroCasa } from "../Helper/enum";

export interface MembroCasaDTO_Criar {
    casaId: number;
    usuarioId: number;
    papel?: PapelMembroCasa;
    status?: StatusMembroCasa;
}
export interface adicionarMembroDTO {
    casaId: number;
    codigo: string;
    usuarioId: number;
}
export interface convidarMembroDTO {
    casaId: number;
    emailDestinatario: string;
}