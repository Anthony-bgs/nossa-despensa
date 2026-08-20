import type { LocalArmazenamento } from '../locais-armazenamento/local-armazenamento.interface';
import type { ProdutoDespensa } from '../produtos-despensa/produto-despensa.interface';

export interface Despensa {
  id: number;
  nome: string;
  idUsuario: number;
  criadoEm: string | Date;
  quantidadeProdutos?: number;
  quantidadeLocaisArmazenamento?: number;
  locaisArmazenamentoDespensa?: LocalArmazenamento[];
}