import { Status, StatusValidade } from './lote.interface';

export interface AdicionarLoteDTO {
  idProdutoDespensa: number;
  quantidade: number;
  validade: Date;
  statusLote ?: Status;
}

export interface AtualizarLoteDTO {
  quantidade?: number;
  validade?: Date;
  statusLote?: Status;
}

export interface DeletarLoteDTO {
  idProdutoDespensa: number;
  idLote: number;
}
