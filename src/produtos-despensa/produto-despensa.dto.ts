export interface CriarItensDespensaDTO {
  casaId: number;
  idDespensa: number;
  idProduto: number;
  idCategoria?: number | null;
  idLocal?: number | null;
  statusProduto?: string;
  quantidade?: number;
  validade?: Date | null;
}

export interface AtualizarProdutoDespensaDTO {
  idDespensa?: number;
  idProduto?: number;
  idCategoria?: number | null;
  idLocal?: number | null;
  statusProduto?: string;
  estoqueTotalProduto?: number;
}
