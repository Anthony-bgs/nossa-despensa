import { PapelMembroCasa, StatusMembroCasa } from "../Helper/enum";

export interface MembroCasaSchema {
	id: number;
	casa_id: number;
	usuario_id: number;
	papel: PapelMembroCasa;
	status: StatusMembroCasa;
	criado_em: Date;
	atualizado_em: Date | null;
}

export interface MembroCasaSchema_Criar {
	casa_id: number;
	usuario_id: number;
	codigo?:string;
	papel?: PapelMembroCasa;
	status?: StatusMembroCasa;
}