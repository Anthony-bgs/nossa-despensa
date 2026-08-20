import { Injectable, NotFoundException } from '@nestjs/common';
import { Despensa } from './despensa.interface';
import { CriarDespensaDTO, AtualizarDespensaDTO } from './despensa.dto';
import { supabase } from '../utils/supabase';

@Injectable()
export class DespensaService {
  async criar(dados: CriarDespensaDTO, idUsuario: number): Promise<Despensa> {

    const { data, error } = await supabase
      .from('despensas')
      .insert({
        id_usuario: idUsuario,
        nome: dados.nome,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapDespensa(data);
  }

  async listarPorUsuario(idUsuario: number): Promise<Despensa[]> {
    const { data, error } = await supabase
      .from('despensas')
      .select(`
        id,
        nome,
        id_usuario,
        criado_em,
        produtos_despensa!left(count),
        locais_armazenamento_despensa!left(count)
      `)
      .eq('id_usuario', idUsuario)
      .order('criado_em', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => ({
      id: item.id,
      nome: item.nome,
      idUsuario: item.id_usuario,
      criadoEm: item.criado_em,
      quantidadeProdutos: Number(item.produtos_despensa?.[0]?.count ?? 0),
      quantidadeLocaisArmazenamento: Number(
        item.locais_armazenamento_despensa?.[0]?.count ?? 0,
      ),
    }));
  }

  async buscarPorId(id: number): Promise<Despensa | null> {
    const { data, error } = await supabase
      .from('despensas')
      .select(`*,
        locais_armazenamento_despensa(id, local)
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapDespensaDetalhes(data);
  }

  async atualizar(id: number, dados: AtualizarDespensaDTO): Promise<Despensa> {
    const despensaExistente = await this.buscarPorId(id);
    if (!despensaExistente) {
      throw new NotFoundException('Despensa não encontrada');
    }

    const payload: AtualizarDespensaDTO = dados

    const { data, error } = await supabase
      .from('despensas')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapDespensa(data);
  }

  async remover(id: number): Promise<void> {
    const despensa = await this.buscarPorId(id);
    if (!despensa) {
      throw new NotFoundException('Despensa não encontrada');
    }

    const { error } = await supabase
      .from('despensas')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapDespensa(despensa: any): Despensa {
    return {
      id: despensa.id,
      nome: despensa.nome,
      idUsuario: despensa.id_usuario,
      criadoEm: despensa.criado_em,
    };
  }

  private mapDespensaDetalhes(despensa: any): Despensa {
    return {
      id: despensa.id,
      nome: despensa.nome,
      idUsuario: despensa.id_usuario,
      criadoEm: despensa.criado_em,
      quantidadeProdutos: Number(
        Array.isArray(despensa.produtos_despensa)
          ? despensa.produtos_despensa.length
          : despensa.produtos_despensa?.[0]?.count ?? 0,
      ),
      quantidadeLocaisArmazenamento: Number(
        Array.isArray(despensa.locais_armazenamento_despensa)
          ? despensa.locais_armazenamento_despensa.length
          : despensa.locais_armazenamento_despensa?.[0]?.count ?? 0,
      ),
      locaisArmazenamentoDespensa: Array.isArray(despensa.locais_armazenamento_despensa)
        ? despensa.locais_armazenamento_despensa.map((item: any) => ({
          id: item.id,
          local: item.local,
          idDespensa: item.id_despensa,
          criadoEm: item.criado_em,
        }))
        : [],
    }
  }
}
