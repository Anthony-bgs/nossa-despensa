export interface LocalArmazenamento {
  id: number;
  local: string;
  descricao?: string | null;
  idDespensa: number;
  criadoEm: string | Date;
}
