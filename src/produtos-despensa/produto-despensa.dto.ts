export interface CriarProdutoDespensaDTO {
  idDespensa: number;
  idProduto: number;
  idCategoria?: number | null;
  idLocalArmazenamento?: number | null;
  statusProduto?: string;
  estoqueTotalProduto?: number;
}

export interface AtualizarProdutoDespensaDTO {
  idDespensa?: number;
  idProduto?: number;
  idCategoria?: number | null;
  idLocalArmazenamento?: number | null;
  statusProduto?: string;
  estoqueTotalProduto?: number;
}
