export interface CriarLocalArmazenamentoDTO {
  nome: string;
  descricao?: string | null;
}

export interface AtualizarLocalArmazenamentoDTO {
  nome?: string;
  descricao?: string | null;
}
