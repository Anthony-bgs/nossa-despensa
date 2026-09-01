export interface UsuarioSchema {
  id: number;
  nome: string;
  email: string;
  senha: string;
  foto: string | null;
  telefone: string | null;
  cpf: string | null;
  criado_em: Date;
  atualizado_em: Date | null;
}