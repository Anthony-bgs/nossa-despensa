import { Injectable, NotFoundException } from '@nestjs/common';
import { LocalArmazenamento } from './local-armazenamento.interface';
import {
  CriarLocalArmazenamentoDTO,
  AtualizarLocalArmazenamentoDTO,
} from './local-armazenamento.dto';
import { supabase } from '../utils/supabase';

@Injectable()
export class LocalArmazenamentoService {
  async criar(dados: CriarLocalArmazenamentoDTO): Promise<LocalArmazenamento> {
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .insert({
        local: dados.local,
        id_despensa: dados.idDespensa
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapLocal(data);
  }

  async listar(): Promise<LocalArmazenamento[]> {
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .select('*')
      .order('local', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapLocal(item));
  }

  async buscarPorId(id: number): Promise<LocalArmazenamento | null> {
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapLocal(data);
  }

  async atualizar(
    id: number,
    dados: AtualizarLocalArmazenamentoDTO,
  ): Promise<LocalArmazenamento> {
    const localExistente = await this.buscarPorId(id);
    if (!localExistente) {
      throw new NotFoundException('Local de armazenamento não encontrado');
    }

    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .update({
        local: dados.local ?? localExistente.local,
        id_despensa: dados.idDespensa ?? localExistente.idDespensa,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapLocal(data);
  }

  async remover(id: number): Promise<void> {
    const local = await this.buscarPorId(id);
    if (!local) {
      throw new NotFoundException('Local de armazenamento não encontrado');
    }

    const { error } = await supabase
      .from('locais_armazenamento_despensa')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapLocal(local: any): LocalArmazenamento {
    return {
      id: local.id,
      local: local.local,
      idDespensa: local.id_despensa,
      criadoEm: local.criado_em,
    };
  }
}
