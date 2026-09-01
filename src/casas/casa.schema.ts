export interface CasaSchema {
  id?: number;
  nome?: string;
  usuario_id?: number;
  descricao?: string | null;
  criado_em?: Date;
  atualizado_em?: Date | null;
}

export interface CasaSchema_Criar {
  nome: string;
  descricao?: string;
}