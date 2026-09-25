import { StatusItemDespensa } from "../Helper/enum";

export interface ItemDespensa {
  id: number;
  casa_id: number;
  despensa_id: number;
  produto_id: number;
  quantidade: number;
  status: StatusItemDespensa;
  criado_em: Date;
  local_armazenamento_id: number | null;
  categoria_id: number | null;
  quantidade_minima: number | null;
  validade: string | null;
  comprado_em: string | null;
  atualizado_em: Date | null;
}
