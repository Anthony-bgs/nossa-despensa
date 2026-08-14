import { Status, StatusValidade } from './lote.interface';

export interface AdicionarLoteDTO {
  id_produto_despensa: number;
  quantidade: number;
  validade?: Date | string | null;
  status?: Status;
}

export interface AtualizarLoteDTO {
  quantidade?: number;
  validade?: Date | string | null;
  status?: Status;
  status_validade?: StatusValidade;
}