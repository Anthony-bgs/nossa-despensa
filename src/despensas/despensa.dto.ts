export interface CriarDespensaDTO {

  nome: string;
  casaId: number;
  tipo?: string;
  descricao?: string;
}

export interface AtualizarDespensaDTO {
  nome: string;
}
