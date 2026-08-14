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
      .from('locais_armazenamento')
      .insert({
        nome: dados.nome,
        descricao: dados.descricao ?? null,
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
      .from('locais_armazenamento')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapLocal(item));
  }

  async buscarPorId(id: number): Promise<LocalArmazenamento | null> {
    const { data, error } = await supabase
      .from('locais_armazenamento')
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
      .from('locais_armazenamento')
      .update({
        nome: dados.nome ?? localExistente.nome,
        descricao: dados.descricao ?? localExistente.descricao ?? null,
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
      .from('locais_armazenamento')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapLocal(local: any): LocalArmazenamento {
    return {
      id: local.id,
      nome: local.nome,
      descricao: local.descricao ?? null,
      criado_em: local.criado_em,
    };
  }
}
