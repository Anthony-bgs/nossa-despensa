import { Injectable, NotFoundException } from '@nestjs/common';
import { Categoria } from './categoria.interface';
import { CriarCategoriaDTO, AtualizarCategoriaDTO } from './categoria.dto';
import { supabase } from '../utils/supabase';

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

  async listar(): Promise<Categoria[]> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .order('nome', { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map((item) => this.mapCategoria(item));
  }

  async buscarPorId(id: number): Promise<Categoria | null> {
    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapCategoria(data);
  }

  async atualizar(id: number, dados: AtualizarCategoriaDTO): Promise<Categoria> {
    const categoriaExistente = await this.buscarPorId(id);
    if (!categoriaExistente) {
      throw new NotFoundException('Categoria não encontrada');
    }

    const { data, error } = await supabase
      .from('categorias')
      .update({ nome: dados.nome ?? categoriaExistente.nome })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapCategoria(data);
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
