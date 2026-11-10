import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { LocalArmazenamento } from './local-armazenamento.interface';
import {
  CriarLocalArmazenamentoDTO,
  AtualizarLocalArmazenamentoDTO,
} from './local-armazenamento.dto';
import { supabase } from '../utils/supabase';
import { PadraoMensagem } from '../utils/padraomensagem';

@Injectable()
export class LocalArmazenamentoService {
  async criar(dados: CriarLocalArmazenamentoDTO): Promise<LocalArmazenamento> {
    if (!dados.local || !dados.idDespensa) {
      throw new BadRequestException(PadraoMensagem.ERRO_DADOS_INCOMPLETOS);
    }                                                                                                                                                                                               
    const { data, error } = await supabase
      .from('locais_armazenamento')
      .insert({
        nome: dados.local,
        despensa_id: dados.idDespensa,
        observacao: dados.observacao ?? null,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
    }

    return this.mapLocal(data);
  }

  async listar(): Promise<LocalArmazenamento[]> {
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .select('*')
      .order('local', { ascending: true });

    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
    }

    return (data ?? []).map((item) => this.mapLocal(item));
  }

  async buscarPorId(id: number): Promise<LocalArmazenamento | null> {
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .select('*')
      .eq('id', id)
      .single();

    if (!data) {
      return null;
    }
    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
    }

    return this.mapLocal(data);
  }

  async atualizar(
    id: number,
    dados: AtualizarLocalArmazenamentoDTO,
  ): Promise<LocalArmazenamento> {
    const localExistente = await this.buscarPorId(id);
    if (!localExistente) {
      throw new NotFoundException(PadraoMensagem.ERRO_NAO_ENCONTRADO);
    }
    const { data, error } = await supabase
      .from('locais_armazenamento_despensa')
      .update({
        local: dados.local ?? localExistente.local,
        id_despensa: dados.idDespensa ?? localExistente.idDespensa,
        descricao: dados.descricao ?? localExistente.descricao,
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
    }

    return this.mapLocal(data);
  }

  async remover(id: number): Promise<void> {
    const local = await this.buscarPorId(id);
    if (!local) {
      throw new NotFoundException(PadraoMensagem.ERRO_NAO_ENCONTRADO);
    }

    const { error } = await supabase
      .from('locais_armazenamento_despensa')
      .delete()
      .eq('id', id);

    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
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
