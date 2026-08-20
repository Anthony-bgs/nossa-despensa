import { Injectable, NotFoundException } from '@nestjs/common';
import { ProdutoDespensa } from './produto-despensa.interface';
import {
  CriarProdutoDespensaDTO,
  AtualizarProdutoDespensaDTO,
} from './produto-despensa.dto';
import { supabase } from '../utils/supabase';
import { StatusDespensa } from '../Helper/enum';

@Injectable()
export class ProdutoDespensaService {
  async criar(dados: CriarProdutoDespensaDTO): Promise<ProdutoDespensa> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .insert({
        id_despensa: dados.idDespensa,
        id_produto: dados.idProduto,
        id_categoria: dados.idCategoria ?? null,
        id_local: dados.idLocal ?? null,
        estoque_total_produto: dados.estoqueTotalProduto ?? 0,
        status_produto: dados.estoqueTotalProduto && dados.estoqueTotalProduto > 0 ? StatusDespensa.EM_ESTOQUE : StatusDespensa.EM_FALTA,
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

  async buscarPorIdDespensa(idDespensa: number): Promise<ProdutoDespensa[]> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .select('*')
      .eq('id_despensa', idDespensa);

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapProdutoDespensa(item));
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
        id_despensa: dados.idDespensa ?? itemExistente.idDespensa,
        id_produto: dados.idProduto ?? itemExistente.idProduto,
        id_categoria: dados.idCategoria ?? itemExistente.idCategoria ?? null,
        id_local_armazenamento:dados.idLocal ?? itemExistente.idLocal ?? null,
        estoque_total_produto:dados.estoqueTotalProduto ?? itemExistente.estoqueTotalProduto,
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
      idDespensa: item.id_despensa,
      idProduto: item.id_produto,
      idCategoria: item.id_categoria ?? null,
      idLocal: item.id_local ?? null,
      statusProduto: item.status_produto,
      estoqueTotalProduto: item.estoque_total_produto,
      criadoEm: item.criado_em,
    };
  }
}
