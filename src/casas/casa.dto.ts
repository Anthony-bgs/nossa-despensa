import { Grandeza } from "../Helper/enum";


export interface CasaCriarDTO {
	nome: string;
	descricao?: string;
}

export interface EntrarComConviteDTO {
	codigo: string;
}
export interface CriacaoCompletaDTO {
	casa: string;
	itens: [Itens];

}
export interface Itens {
	//despensa
	despensa: string;
	//localdearmazenamento
	prateleira: string;
	//produto
	produtos: [IProdutos]

}
export interface IProdutos {
	codigoBarras: string;
	nome: string;
	marca: string;
	tamanhoPadrao: number;
	unidadeMedida: Grandeza;
	criadoEm: string;
	atualizadoEm: string;
	id: number;
	itemDespensa: {
		quantidade: number;
		validade: Date;
		categoria: number;
	}
}