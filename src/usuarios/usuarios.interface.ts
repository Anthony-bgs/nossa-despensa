export interface Usuario {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    foto?: string;
    cpf?: string;
}

export interface UsuarioLogin{
    id: number;
    email: string;
}