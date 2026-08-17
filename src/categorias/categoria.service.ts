import { Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from './categoria.interface';
import { CriarCategoriaDTO, AtualizarCategoriaDTO, BuscarCategoriaDTO } from './categoria.dto';
import { supabase } from '../utils/supabase';
import { PadraoMensagem } from '../utils/padraomensagem';

@Injectable()
export class CategoriaService {
  async criar(dados: CriarCategoriaDTO): Promise<Categoria> {
    const { data, error } = await supabase
      .from('categorias')
      .insert({ nome: dados.nome })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapCategoria(data);
  }

  async listar(dados: BuscarCategoriaDTO): Promise<Categoria[]> {
    const { nome } = dados ?? {};
    let query = supabase.from('categorias').select('*').order('nome', { ascending: true });
    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }
    const { data, error } = await query;
    if (error) { throw error; }
    return (data ?? []).map((item) => this.mapCategoria(item));
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      throw new Error(PadraoMensagem.ERRO_NAO_ENCONTRADO);
    }
    return this.mapCategoria(data);
  }

  async atualizar(id: number, dados: AtualizarCategoriaDTO): Promise<string> {
    const categoriaExistente = await this.buscarPorId(id);
    if (!categoriaExistente) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const { data, error } = await supabase
      .from('categorias')
      .update({ nome: dados.nome ?? categoriaExistente.nome })
      .eq('id', id)
      .select('id')
      .single();

    if (error) {
      throw error;
    }

    return PadraoMensagem.SUCESSO_ATUALIZACAO;
  }

  async remover(id: number): Promise<void> {
    const categoria = await this.buscarPorId(id);
    if (!categoria) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapCategoria(categoria: any): Categoria {
    return {
      id: categoria.id,
      nome: categoria.nome,
      criado_em: categoria.criado_em,
    };
  }
}
