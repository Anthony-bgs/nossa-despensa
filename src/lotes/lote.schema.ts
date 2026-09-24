import { StatusItemDespensa } from "../Helper/enum";

export interface Lote {
  id: number;
  item_despensa_id: number;
  quantidade: number;
  status: StatusItemDespensa;
  criado_em: Date;
  validade: Date;
  comprado_em: string | null;
  atualizado_em: Date | null;
}