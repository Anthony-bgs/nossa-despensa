export interface Produto {
    id: number;
    nome: string;
    marca: string;
    codigo_barras: string;
    tamanho_padrao: string;
    unidade_medida: string;
    criado_em: Date;
    atualizado_em: Date | null;
}