import { PrioridadeListaCompra } from "../Helper/enum";

export interface ItemListaCompra {
  id: number;
  lista_compra_id: number;
  produto_id: number;
  quantidade: number;
  prioridade: PrioridadeListaCompra;
  comprado: boolean;
  observacao: string | null;
  atualizado_em: Date | null;
}
