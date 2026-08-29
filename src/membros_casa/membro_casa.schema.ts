import { PapelMembroCasa, StatusMembroCasa } from "../Helper/enum";

export interface MembroCasa {
	id: number;
	casa_id: number;
	usuario_id: number;
	papel: PapelMembroCasa;
	status: StatusMembroCasa;
	criado_em: Date;
	atualizado_em: Date | null;
}