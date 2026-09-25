export interface UsuarioDto {
  nome: string;
  email: string;
  senha: string;
  cpf?: string;
  foto?: string;
  telefone?: string;
}

export interface UsuarioAtualizarDto {
  nome?: string;
  email?: string;
  senha?: string;
  cpf?: string;
  foto?: string;
  telefone?: string;
}