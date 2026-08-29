export interface LocalArmazenamento {
    id: number;
    despensa_id: number;
    nome: string;
    tipo: string;
    ordem: number | null;
    observacao: string | null;
    criado_em: Date;
    atualizado_em: Date | null;
}