export interface Categoria {
    id: number;
    casa_id: number;
    nome: string;
    descricao: string | null;
    criado_em: Date;
    atualizado_em: Date | null;
}