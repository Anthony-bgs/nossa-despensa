import { PapelMembroCasa, StatusMembroCasa } from "../Helper/enum";

export interface UsuarioCasaResumo {
    id?: number;
    nome?: string;
    email?: string;
    foto?: string | null;
}

export interface MembroCasaResumo {
    id?: number;
    usuarioId?: number;
    usuario?: UsuarioCasaResumo;
    papel?: PapelMembroCasa;
    status?: StatusMembroCasa;
}

export interface Casa {
    id?: number;
    nome?: string;
    descricao?: string | null;
    criadoPor?: number;
    criadoEm?: string;
    atualizadoEm?: string | null;
    membros?: MembroCasaResumo[];
}