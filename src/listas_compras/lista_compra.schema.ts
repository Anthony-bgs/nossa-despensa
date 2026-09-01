import { StatusListaCompra } from "../Helper/enum";

export interface ListaCompra {
    id: number;
    casa_id: number;
    criada_por: number;
    nome: string;
    status: StatusListaCompra;
    criado_em: Date;
    atualizado_em: Date | null;
}