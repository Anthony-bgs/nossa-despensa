import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Categoria, Grandeza, LocalArmazenamento, Produto, Status } from './produto.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NovoProdutoDTO } from './produto.dto';
import { LoteService } from '../lotes/lote.service';
import { Lote } from '../lotes/lote.interface';

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

  async buscarTodosProdutos(filtro?: Partial<Produto>): Promise<Produto[]> {
    let letra = filtro?.nome
    if (filtro?.nome) {
      return await this.produtoModel.find({ nome: { $regex: letra, $options: 'i' } }).sort({ nome: 1 }).select("nome marca categoria grandeza status estoqueTotal localArmazenamento images")
    }
    return await this.produtoModel.find({ ...filtro }).sort({ nome: 1 })
    // .select("nome marca categoria grandeza status estoqueTotal localArmazenamento images")
  }

  async buscarProdutoPorId(id: string): Promise<Produto | null> {
    return await this.produtoModel.findById(id).populate("lotes", "validade quantidade status statusValidade");;
  }

  async atualizarLote(_id: string, lote: Lote, estoqueTotal: number): Promise<void> {
    const status = estoqueTotal > 0 ? Status.EM_ESTOQUE : Status.EM_FALTA;
    await this.produtoModel.findByIdAndUpdate(_id, { $push: { lotes: lote._id }, $set: { estoqueTotal, status } }, { new: true });
  }
}
