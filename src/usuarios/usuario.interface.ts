export interface Usuario {
    id: number;
    nome: string;
    email: string;
    telefone?: string;
    foto?: string;
    cpf?: string;
    criadoEm?: string;
    atualizadoEm?: string;
}

export interface UsuarioLogin {
    id: number;
    email: string;
}

export interface UsuarioToken {
    usuario: {
        id: number;
        email: string;
        iat: number,
        exp: number
    }
}