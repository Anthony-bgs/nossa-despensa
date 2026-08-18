export interface CriarLocalArmazenamentoDTO {
  local: string;
  idDespensa: number;
  descricao?: string | null;
}

export interface AtualizarLocalArmazenamentoDTO {
  local?: string;
  idDespensa?: number;
}
