export interface LocalArmazenamento {
  id: number;
  nome: string;
  descricao?: string | null;
  criado_em: string | Date;
}
