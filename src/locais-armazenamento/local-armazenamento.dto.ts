export interface CriarLocalArmazenamentoDTO {
  local: string;
  idDespensa: number;
  observacao?: string | null;
}

export interface AtualizarLocalArmazenamentoDTO {
  local?: string;
  idDespensa?: number;
  descricao?: string | null;
}
