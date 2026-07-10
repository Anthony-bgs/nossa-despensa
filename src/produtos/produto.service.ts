import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Categoria, Grandeza, LocalArmazenamento, Produto, Status } from './produto.interface';
import { InjectModel } from '@nestjs/mongoose';
import { _QueryFilter, Model } from 'mongoose';
import { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { LoteService } from '../lotes/lote.service';
import { Lote } from '../lotes/lote.interface';
import { PaginacaoDTO } from '../Helper/paginacaodto';
import { TAMANHO_PAGINA_PADRAO } from '../Helper/constantes';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectModel('Produto') private produtoModel: Model<Produto>,
    @Inject(forwardRef(() => LoteService))
    private readonly loteService: LoteService,
  ) { }

  async novoProduto(dados: NovoProdutoDTO): Promise<Produto> {
    const novoProduto = new this.produtoModel({
      ...dados,
      nome: dados.nome.toLowerCase(),
      marca: dados.marca.toLowerCase(),
      categoria: Categoria[dados.categoria],
      grandeza: Grandeza[dados.grandeza],
      localArmazenamento: LocalArmazenamento[dados.localArmazenamento],
    });
    return novoProduto.save();
  }

  async buscarTodosProdutos(filtro?: Partial<FiltroDTO>, paginacao?: PaginacaoDTO): Promise<Produto[]> {
    
    const filtroProduto: _QueryFilter<Produto> = { ...filtro };
   
    if (filtro?.nome) {
      let letraRegex = new RegExp(filtro.nome, "i");
      filtroProduto.nome = letraRegex;
    }

    if (filtro?.filtroValidade) {
      let dataHoje = new Date();
      let dataFinal = new Date();
      let filtroValidade = filtro.filtroValidade;
      dataFinal.setDate(dataHoje.getDate() + Number(filtroValidade));
      delete filtroProduto.filtroValidade;
      return (await this.produtoModel.find(filtroProduto, null, {  skip: paginacao?.pule ?? 0, limit: paginacao?.limite ?? TAMANHO_PAGINA_PADRAO}
      ).sort({ nome: 1 }).populate("lotes", "validade")).filter((produto) => {
        return produto.lotes.some((lote) => lote.validade <= dataFinal);
      })
    } else {
      delete filtroProduto.filtroValidade;
      return await this.produtoModel.find(filtroProduto,null, {  skip: paginacao?.pule ?? 0, limit: paginacao?.limite ?? TAMANHO_PAGINA_PADRAO}).sort({ nome: 1 }).populate("lotes", "validade");
    }
    // .select("nome marca categoria grandeza status estoqueTotal localArmazenamento images")
  }

  async buscarProdutoPorId(id: string): Promise<Produto | null> {
    return await this.produtoModel.findById(id).populate("lotes", "validade quantidade status statusValidade");
  }

  async atualizarLote(_id: string, lote: Lote, estoqueTotal: number): Promise<void> {
    const status = estoqueTotal > 0 ? Status.EM_ESTOQUE : Status.EM_FALTA;
    await this.produtoModel.findByIdAndUpdate(_id, { $push: { lotes: lote._id }, $set: { estoqueTotal, status } }, { new: true });
  }
  async atualizarProduto(_id: string, dados: AtualizarProdutoDTO): Promise<Produto | null> {
    if (dados.nome) dados.nome = dados.nome.toLowerCase();
    if (dados.marca) dados.marca = dados.marca.toLowerCase();
    return await this.produtoModel.findOneAndUpdate({ _id }, { ...dados })
  }
  async deletarProduto(_id: string): Promise<Produto | null> {
    return await this.produtoModel.findByIdAndDelete(_id)
  }
}
