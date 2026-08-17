import { Injectable, NotFoundException } from '@nestjs/common';
import { Lote, Status, StatusValidade } from './lote.interface';
import { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
import { supabase } from '../utils/supabase';

@Injectable()
export class LoteService {
  async adicionarLote(dados: AdicionarLoteDTO, idprodutoDespensa: number): Promise<Lote> {
    console.log(idprodutoDespensa)
    const produtoDespensa = await this.buscarProdutoDespensaPorId(idprodutoDespensa);
    console.log(produtoDespensa);
    if (!produtoDespensa) {
      throw new NotFoundException('Produto da despensa não encontrado');
    }

    const payload = {
      id_produto_despensa: dados.id_produto_despensa,
      quantidade: Number(dados.quantidade ?? 0),
      validade: dados.validade ? new Date(dados.validade).toISOString() : null,
      status: dados.status ?? Status.ABERTO,
      status_validade: this.calcularStatusValidade(dados.validade ?? null),
    };

    const { data, error } = await supabase
      .from('lotes')
      .insert(payload)
      .eq ('id_produto_despensa', dados.id_produto_despensa)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const loteSalvo = this.mapLote(data);
    await this.atualizarEstoqueProdutoDespensa(dados.id_produto_despensa, Number(dados.quantidade ?? 0));

    return loteSalvo;
  }  
  async atualizarLote(id: number, dados: AtualizarLoteDTO): Promise<Lote> {
    const loteExistente = await this.buscarLotePorId(id);
    if (!loteExistente) {
      throw new NotFoundException('Lote não encontrado');
    }
  

    const payload = {
      quantidade: dados.quantidade ?? loteExistente.quantidade,
      validade: dados.validade ? new Date(dados.validade).toISOString() : loteExistente.validade?.toISOString() ?? null,
      status: dados.status ?? loteExistente.status,
      status_validade:
        dados.status_validade ??
        this.calcularStatusValidade(dados.validade ?? loteExistente.validade ?? null),
    };

    const { data, error } = await supabase
      .from('lotes')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapLote(data);
  }

  async deletarLote(id: number): Promise<void> {
    const lote = await this.buscarLotePorId(id);
    if (!lote) {
      throw new NotFoundException('Lote não encontrado');
    }

    const { error } = await supabase
      .from('lotes')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    await this.atualizarEstoqueProdutoDespensa(lote.id_produto_despensa, -lote.quantidade);
  }

  async deletarLotePorProduto(produtoId: string): Promise<void> {
    const { data: itensProdutoDespensa, error: itensError } = await supabase
      .from('produtos_despensa')
      .select('id')
      .eq('id_produto', produtoId);

    if (itensError) {
      throw itensError;
    }

    const idsProdutoDespensa = (itensProdutoDespensa ?? []).map((item) => item.id);

    if (idsProdutoDespensa.length === 0) {
      return;
    }

    const { error } = await supabase
      .from('lotes')
      .delete()
      .in('id_produto_despensa', idsProdutoDespensa);

    if (error) {
      throw error;
    }
  }

  async listarPorProdutoDespensa(idProdutoDespensa: number): Promise<Lote[]> {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id_produto_despensa', idProdutoDespensa)
      .order('criado_em', { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapLote(item));
  }

  async buscarLotePorId(id: number): Promise<Lote | null> {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapLote(data);
  }

  async calcularEstoqueTotalDosLotesPorProdutoDespensa(idProdutoDespensa: number): Promise<number> {
    const { data, error } = await supabase
      .from('lotes')
      .select('quantidade')
      .eq('id_produto_despensa', idProdutoDespensa);

    if (error) {
      throw error;
    }

    return (data ?? []).reduce((total, lote) => total + Number(lote.quantidade ?? 0), 0);
  }

  calcularStatusValidade(validade: Date | string | null): StatusValidade {
    if (!validade) {
      return StatusValidade.VALIDO;
    }

    const hoje = new Date();
    const dataValidade = new Date(validade);
    const diffDias = Math.ceil(
      (dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffDias < 0) {
      return StatusValidade.VENCIDO;
    }

    if (diffDias <= 30) {
      return StatusValidade.VENCENDO;
    }

    return StatusValidade.VALIDO;
  }

  private async buscarProdutoDespensaPorId(id: number): Promise<{ id: number; estoque_total_produto: number } | null> {
    const { data, error } = await supabase
      .from('produtos_despensa')
      .select('id, estoque_total_produto')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  private async atualizarEstoqueProdutoDespensa(idProdutoDespensa: number, delta: number): Promise<void> {
    const produtoDespensa = await this.buscarProdutoDespensaPorId(idProdutoDespensa);
    if (!produtoDespensa) {
      return;
    }

    const novoEstoque = Number(produtoDespensa.estoque_total_produto ?? 0) + Number(delta ?? 0);

    const { error } = await supabase
      .from('produtos_despensa')
      .update({ estoque_total_produto: novoEstoque })
      .eq('id', idProdutoDespensa);

    if (error) {
      throw error;
    }
  }

  private mapLote(lote: any): Lote {
    return {
      id: lote.id,
      id_produto_despensa: lote.id_produto_despensa,
      quantidade: Number(lote.quantidade ?? 0),
      validade: lote.validade ? new Date(lote.validade) : null,
      status: lote.status,
      status_validade: lote.status_validade ?? StatusValidade.VALIDO,
      criado_em: lote.criado_em,
    };
  }
}
