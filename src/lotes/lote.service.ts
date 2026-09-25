import { Injectable, NotFoundException } from '@nestjs/common';
import { Lote, LoteSchema, Status, StatusValidade } from './lote.interface';
import { AdicionarLoteDTO, AtualizarLoteDTO, DeletarLoteDTO } from './lote.dto';
import { supabase } from '../utils/supabase';
import { ProdutoDespensaService } from '../produtos-despensa/produto-despensa.service';

@Injectable()
export class LoteService {
  constructor(private readonly produtoDespensaService: ProdutoDespensaService) { }

  async adicionarLote(dados: AdicionarLoteDTO, userId: number): Promise<Lote> {
    const usuarioconfirmado = await this.produtoDespensaService.confirmarUsuario(dados.idProdutoDespensa, userId);
    if (!usuarioconfirmado ) {
      throw new NotFoundException('Produto da despensa não encontrado para este usuário');
    }
    const produtoDespensa = await this.buscarProdutoDespensaPorId(dados.idProdutoDespensa);
    if (!produtoDespensa) {
      throw new NotFoundException('Produto da despensa não encontrado');
    }

    const payload = {
      id_ass_produto_despensa: dados.idProdutoDespensa,
      quantidade: Number(dados.quantidade ?? 0),
      validade_produto: dados.validade ? new Date(dados.validade) : null,
      status_lote: dados.statusLote ?? Status.ABERTO,
      status_validade: this.calcularStatusValidade(dados.validade ?? null),
    };

    const { data, error } = await supabase
      .from('lotes')
      .insert(payload)
      .eq('id_ass_produto_despensa', dados.idProdutoDespensa)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    const loteSalvo = this.mapLote(data);
    await this.atualizarEstoqueProdutoDespensa(dados.idProdutoDespensa, Number(dados.quantidade ?? 0));
    return loteSalvo;
  }
  async atualizarLote(id: number, dados: AtualizarLoteDTO): Promise<Lote> {
    const loteExistente = await this.buscarLotePorIdInterno(id);
    if (!loteExistente) {
      throw new NotFoundException('Lote não encontrado');
    }


    const payload = {
      quantidade: dados.quantidade ?? loteExistente.quantidade,
      validade_produto: dados.validade ? new Date(dados.validade).toISOString() : loteExistente.validade_produto ?? null,
      status_lote: dados.statusLote ?? loteExistente.status_lote,
      status_validade:
        this.calcularStatusValidade(dados.validade ?? loteExistente.validade_produto ?? null),
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

  async deletarLote(data : DeletarLoteDTO, userId: number): Promise<void> {
    await this.produtoDespensaService.confirmarUsuario(data.idProdutoDespensa, userId);
    const lote = await this.buscarLotePorId(data.idLote);
    if (!lote) {
      throw new NotFoundException('Lote não encontrado');
    }

    const { error } = await supabase
      .from('lotes')
      .delete()
      .eq('id', data.idLote);

    if (error) {
      throw error;
    }

    await this.atualizarEstoqueProdutoDespensa(lote.id_ass_produto_despensa, -lote.quantidade);
  }

  async deletarLotePorProduto(idProdutoDespensa: number, idUsuario: number): Promise<void> {
    await this.produtoDespensaService.confirmarUsuario(idProdutoDespensa, idUsuario);
    if (!true) {
      throw new NotFoundException('Produto da despensa não encontrado para este usuário');
    }
    const { data: itensProdutoDespensa, error: itensError } = await supabase
      .from('produtos_despensa')
      .select('*')
      .eq('id', idProdutoDespensa);

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
      .in('id_ass_produto_despensa', idsProdutoDespensa);

    if (error) {
      throw error;
    }
  }

  async listarPorProdutoDespensa(idProdutoDespensa: number): Promise<Lote[]> {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id_ass_produto_despensa', idProdutoDespensa)
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
  async buscarLotePorIdInterno(id: number): Promise<LoteSchema | null> {
    const { data, error } = await supabase
      .from('lotes')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return data;
  }

  async calcularEstoqueTotalDosLotesPorProdutoDespensa(idProdutoDespensa: number): Promise<number> {
    const { data, error } = await supabase
      .from('lotes')
      .select('quantidade')
      .eq('id_ass_produto_despensa', idProdutoDespensa);

    if (error) {
      throw error;
    }
    return (data ?? []).reduce((total, lote) => total + lote.quantidade, 0);
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
      id_ass_produto_despensa: lote.id_ass_produto_despensa,
      quantidade: Number(lote.quantidade ?? 0),
      validade_produto: lote.validade_produto ? new Date(lote.validade_produto).toLocaleDateString('pt-BR') : null,
      status_lote: lote.status_lote,
      status_validade: lote.status_validade ?? StatusValidade.VALIDO,
      criado_em: lote.criado_em,
    };
  }
}
