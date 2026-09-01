import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Categoria, Grandeza, ListaDeProdutosInterface, Produto } from './produto.interface';
import { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { PaginacaoDTO } from '../Helper/paginacaodto';
import { TAMANHO_PAGINA_PADRAO } from '../Helper/constantes';
import { supabase } from '../utils/supabase';

@Injectable()
export class ProdutoService {
  async novoProduto(dados: NovoProdutoDTO): Promise<string> {
    const payload = {
      nome: dados.nome.toLowerCase(),
      marca: dados.marca.toLowerCase(),
      grandeza: Grandeza[dados.grandeza],
      tamanho_padrao: dados.tamanhoPadrao,
      codigo_barras: dados.codigoBarras,
    };

    const { data, error } = await supabase
      .from('produtos')
      .insert(payload)
      .select('id')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new ConflictException("codigo de barras já existe");
      }
      throw error;
    }

    return String(data.id);
  }

  async buscarTodosProdutos(filtro?: Partial<FiltroDTO>, paginacao?: PaginacaoDTO): Promise<ListaDeProdutosInterface> {
    const { codigoBarras, nome, marca } = filtro ?? {};
    const { limite, pule } = this.configurarPaginacao(paginacao);

    let query = supabase
           .from('produtos')
      .select ('*', { count: 'exact' });
    if (codigoBarras) {
      query = query.eq('codigo_barras', codigoBarras);
    }

    if (nome) {
      query = query.ilike('nome', `%${nome}%`);
    }
    if (marca) {
      query = query.ilike('marca', `%${marca}%`);
    }

    const { data, error, count } = await query
      .order('id', { ascending: true })
      .range(pule, pule + limite - 1);

    if (error) {
      if (error.code === 'PGRST103') {
        throw new BadRequestException('Parâmetros de paginação inválidos');
      }
      throw error;
    }

    const produtos = (data ?? []).map((produto) => this.mapProduto(produto));

    return {
      totalProdutos: Number(count ?? produtos.length),
      produtos,
      paginacao: {
        total: this.configurarPaginacaoResponse(Number(count ?? produtos.length), limite).totalPaginas,
      },
    };
  }

  async buscarProdutoPorId(id: number): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapProduto(data);
  }

  async atualizarProduto(_id: number, dados: AtualizarProdutoDTO): Promise<Produto | null> {
    const payload: Record<string, any> = {};

    if (dados.nome) payload.nome = dados.nome.toLowerCase();
    if (dados.marca) payload.marca = dados.marca.toLowerCase();
    if (dados.grandeza && dados.grandeza.toUpperCase() in Grandeza) payload.grandeza = Grandeza[dados.grandeza]; else throw new Error(`Valor inválido para grandeza: ${dados.grandeza}`);
    if (dados.tamanhoPadrao && typeof dados.tamanhoPadrao == "number") payload.tamanho_padrao = dados.tamanhoPadrao; else throw new Error(`tamanho padrão não é um numero`);
    if (Object.keys(payload).length === 0) {
      return await this.buscarProdutoPorId(_id);
    }

    const { data, error } = await supabase
      .from('produtos')
      .update(payload)
      .eq('id', _id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data ? this.mapProduto(data) : null;
  }

  async deletarProduto(id: number): Promise<Produto | null> {
    const { data, error } = await supabase
      .from('produtos')
      .delete()
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data ? this.mapProduto(data) : null;
  }

  private configurarPaginacao(paginacao?: PaginacaoDTO): { limite: number; pule: number } {
    const limite = paginacao?.limite ?? TAMANHO_PAGINA_PADRAO;
    const pagina = paginacao?.pagina ?? 0;
    const pule = pagina * limite;
    return { limite, pule };
  }

  private configurarPaginacaoResponse(quantidadeProdutos: number, limite: number): { totalPaginas: number } {
    if (limite) {
      const totalPaginas = Math.ceil(quantidadeProdutos / limite);
      return { totalPaginas };
    }
    const totalPaginas = Math.ceil(quantidadeProdutos / TAMANHO_PAGINA_PADRAO);
    return { totalPaginas };
  }

  private mapProduto(produto: any): Produto {
    return {
      id: Number(produto.id ?? produto._id ?? 0),
      nome: produto.nome,
      marca: produto.marca,
      grandeza: produto.grandeza,
      tamanhoPadrao: produto.tamanho_padrao ?? produto.tamanhoPadrao ?? null,
      codigoBarras: produto.codigo_barras ?? produto.codigoBarras ?? null,
      criadoEm: produto.criado_em ?? null,
    };
  }
}
