import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Lote } from './lote.interface';
import { ProdutoService } from '../produtos/produto.service';
import { AdicionarLoteDTO } from './lote.dto';

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
        await this.produtoService.atualizarLote(produtoId, loteSalvo, produto.estoqueTotal);
        return loteSalvo;
    }
}
