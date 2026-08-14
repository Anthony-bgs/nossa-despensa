export interface ProdutoDespensa {
  id: number;
  id_despensa: number;
  id_produto: number;
  id_categoria?: number | null;
  id_local_armazenamento?: number | null;
  status_produto: string;
  estoque_total_produto: number;
  criado_em: string | Date;
}
