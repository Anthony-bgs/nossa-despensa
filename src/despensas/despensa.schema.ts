export interface Despensa {
  id: number;
  casa_id: number;
  nome: string;
  tipo: string;
  descricao: string | null;
  criado_em: Date;
  atualizado_em: Date | null;
}