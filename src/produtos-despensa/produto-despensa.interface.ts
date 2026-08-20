export interface ProdutoDespensa {
  id: number;
  idDespensa: number;
  idProduto: number;
  idCategoria?: number | null;
  idLocal?: number | null;
  statusProduto: string;
  estoqueTotalProduto: number;
  criadoEm: string | Date;
}
