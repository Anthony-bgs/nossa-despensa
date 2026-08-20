export interface CriarProdutoDespensaDTO {
  idDespensa: number;
  idProduto: number;
  idCategoria?: number | null;
  idLocal?: number | null;
  statusProduto?: string;
  estoqueTotalProduto?: number;
}

export interface AtualizarProdutoDespensaDTO {
  idDespensa?: number;
  idProduto?: number;
  idCategoria?: number | null;
  idLocal?: number | null;
  statusProduto?: string;
  estoqueTotalProduto?: number;
}
