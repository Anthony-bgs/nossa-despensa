import { Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoDespensa } from './produto-despensa.interface';
import {
  CriarProdutoDespensaDTO,
  AtualizarProdutoDespensaDTO,
} from './produto-despensa.dto';
import { supabase } from '../utils/supabase';

@Injectable()
export class ProdutoDespensaService {
  async criar(dados: CriarProdutoDespensaDTO): Promise<ProdutoDespensa> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .insert({
        id_despensa: dados.id_despensa,
        id_produto: dados.id_produto,
        id_categoria: dados.id_categoria ?? null,
        id_local_armazenamento: dados.id_local_armazenamento ?? null,
        status_produto: dados.status_produto ?? 'ativo',
        estoque_total_produto: dados.estoque_total_produto ?? 0,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapProdutoDespensa(data);
  }

  async listar(): Promise<ProdutoDespensa[]> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapProdutoDespensa(item));
  }

  async buscarPorId(id: number): Promise<ProdutoDespensa | null> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapProdutoDespensa(data);
  }

  async atualizar(
    id: number,
    dados: AtualizarProdutoDespensaDTO,
  ): Promise<ProdutoDespensa> {
    const itemExistente = await this.buscarPorId(id);
    if (!itemExistente) {
      throw new NotFoundException('Produto da despensa não encontrado');
    }

    const { data, error } = await supabase
      .from('produtos_despensa')
      .update({
        id_despensa: dados.id_despensa ?? itemExistente.id_despensa,
        id_produto: dados.id_produto ?? itemExistente.id_produto,
        id_categoria: dados.id_categoria ?? itemExistente.id_categoria ?? null,
        id_local_armazenamento:
          dados.id_local_armazenamento ?? itemExistente.id_local_armazenamento ?? null,
        status_produto: dados.status_produto ?? itemExistente.status_produto,
        estoque_total_produto:
          dados.estoque_total_produto ?? itemExistente.estoque_total_produto,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapProdutoDespensa(data);
  }

  async remover(id: number): Promise<void> {
    const item = await this.buscarPorId(id);
    if (!item) {
      throw new NotFoundException('Produto da despensa não encontrado');
    }

    const { error } = await supabase
      .from('produtos_despensa')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapProdutoDespensa(item: any): ProdutoDespensa {
    return {
      id: item.id,
      id_despensa: item.id_despensa,
      id_produto: item.id_produto,
      id_categoria: item.id_categoria ?? null,
      id_local_armazenamento: item.id_local_armazenamento ?? null,
      status_produto: item.status_produto,
      estoque_total_produto: item.estoque_total_produto,
      criado_em: item.criado_em,
    };
  }
}
