import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lote, Status, StatusValidade } from './lote.interface';
import { ProdutoService } from '../produtos/produto.service';
import { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
import { VENCENDO_PADRAO } from '../Helper/constantes';

@Injectable()
export class LoteService {
    constructor(
        @InjectModel('Lote') private loteModel: Model<Lote>,
        @Inject(forwardRef(() => ProdutoService))
        private readonly produtoService: ProdutoService,
    ) { }

    async adicionarLote(dados: AdicionarLoteDTO, produtoId: string): Promise<Lote> {
        const produto = await this.produtoService.buscarProdutoPorId(produtoId);

        if (!produto) {
            throw new NotFoundException('Produto nao encontrado');
        }

        const novoLote = new this.loteModel({ ...dados, produto: produtoId });
        const loteSalvo = await novoLote.save();
        produto.estoqueTotal += dados.quantidade;
        await this.produtoService.adicionarLote(produtoId, loteSalvo, produto.estoqueTotal);
        return loteSalvo;
    }

    async atualizarLote(dados: AtualizarLoteDTO, produtoId: string, loteId: string): Promise<void> {
        const produto = await this.produtoService.buscarProdutoPorId(produtoId);
        const lote = await this.buscarLotePorId(loteId);
        if (!produto || !lote) {
            throw new NotFoundException('Produto ou lote nao encontrado');
        }

        dados.statusValidade = this.calcularStatusValidade(dados.validade);
        dados.status = Status[dados.status];

        await this.loteModel.updateOne({ _id: loteId }, { $set: dados });

        const estoqueTotal = await this.calcularEstoqueTotalDosLotesPorProdutoId(produtoId);

        await this.produtoService.atualizarEstoqueTotal(produtoId, estoqueTotal);
    }

    async deletarLote(loteId: string): Promise<void> {
        const lote = await this.buscarLotePorId(loteId);
        if (!lote) {
            throw new NotFoundException('Lote não encontrado');
        }
        const produto = await this.produtoService.buscarProdutoParaEstoqueTotal(lote.produto);
        if (!produto) {
            throw new NotFoundException('Produto não encontrado');
        }
        const novoEstoqueTotal = produto.estoqueTotal - lote.quantidade;
        //Removendo o lote do produto e atualiza o estoque total do produto
        await this.produtoService.removerLote(produto._id, loteId, novoEstoqueTotal);
        //Deletando o lote do banco de dados
        await this.loteModel.deleteOne({ _id: loteId });
    }

    async buscarLotePorId(loteId: string): Promise<Lote | null> {
        return await this.loteModel.findById(loteId).exec();
    }

    async calcularEstoqueTotalDosLotesPorProdutoId(produtoId: string): Promise<number> {
        const lotes = await this.loteModel.find({ produto: produtoId }).exec();
        return lotes.reduce((total, lote) => total + lote.quantidade, 0);
    }

    calcularStatusValidade(validade: Date): StatusValidade {
        const hoje = new Date();
        const dataValidade = new Date(validade);
        const diffDias = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDias < 0) {
            return StatusValidade.VENCIDO;
        } else if (diffDias <= VENCENDO_PADRAO) {
            return StatusValidade.VENCENDO;
        } else {
            return StatusValidade.VALIDO;
        }
    }
}
