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
      .select('*')
      .eq('id_usuario', idUsuario)
      .order('criado_em', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapDespensa(item));
  }

  async buscarPorId(id: number): Promise<Despensa | null> {
    const { data, error } = await supabase
      .from('despensas')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapDespensa(data);
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
}
