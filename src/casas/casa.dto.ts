export interface CasaCriarDTO {
	nome: string;
	descricao?: string;
}
export interface EmailDTO {
	email: string;
	destinatario: string;
	assunto: string;
	mensagem: string;
}