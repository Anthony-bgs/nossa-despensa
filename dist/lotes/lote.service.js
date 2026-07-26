"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lote_interface_1 = require("./lote.interface");
const produto_service_1 = require("../produtos/produto.service");
const constantes_1 = require("../Helper/constantes");
let LoteService = class LoteService {
    loteModel;
    produtoService;
    constructor(loteModel, produtoService) {
        this.loteModel = loteModel;
        this.produtoService = produtoService;
    }
    async adicionarLote(dados, produtoId) {
        const produto = await this.produtoService.buscarProdutoPorId(produtoId);
        if (!produto) {
            throw new common_1.NotFoundException('Produto nao encontrado');
        }
        const novoLote = new this.loteModel({ ...dados, produto: produtoId });
        const loteSalvo = await novoLote.save();
        produto.estoqueTotal += dados.quantidade;
        await this.produtoService.adicionarLote(produtoId, loteSalvo, produto.estoqueTotal);
        return loteSalvo;
    }
    async atualizarLote(dados, produtoId, loteId) {
        const produto = await this.produtoService.buscarProdutoPorId(produtoId);
        const lote = await this.buscarLotePorId(loteId);
        if (!produto || !lote) {
            throw new common_1.NotFoundException('Produto ou lote nao encontrado');
        }
        dados.statusValidade = this.calcularStatusValidade(dados.validade);
        dados.status = lote_interface_1.Status[dados.status];
        await this.loteModel.updateOne({ _id: loteId }, { $set: dados });
        const estoqueTotal = await this.calcularEstoqueTotalDosLotesPorProdutoId(produtoId);
        await this.produtoService.atualizarEstoqueTotal(produtoId, estoqueTotal);
    }
    async deletarLote(loteId) {
        const lote = await this.buscarLotePorId(loteId);
        if (!lote) {
            throw new common_1.NotFoundException('Lote não encontrado');
        }
        const produto = await this.produtoService.buscarProdutoParaEstoqueTotal(lote.produto);
        if (!produto) {
            throw new common_1.NotFoundException('Produto não encontrado');
        }
        const novoEstoqueTotal = produto.estoqueTotal - lote.quantidade;
        await this.produtoService.removerLote(produto._id, loteId, novoEstoqueTotal);
        await this.loteModel.deleteOne({ _id: loteId });
    }
    async buscarLotePorId(loteId) {
        return await this.loteModel.findById(loteId).exec();
    }
    async deletarLotePorProduto(produtoId) {
        await this.loteModel.deleteMany({ produto: produtoId }).exec();
    }
    async calcularEstoqueTotalDosLotesPorProdutoId(produtoId) {
        const lotes = await this.loteModel.find({ produto: produtoId }).exec();
        return lotes.reduce((total, lote) => total + lote.quantidade, 0);
    }
    calcularStatusValidade(validade) {
        const hoje = new Date();
        const dataValidade = new Date(validade);
        const diffDias = Math.ceil((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDias < 0) {
            return lote_interface_1.StatusValidade.VENCIDO;
        }
        else if (diffDias <= constantes_1.VENCENDO_PADRAO) {
            return lote_interface_1.StatusValidade.VENCENDO;
        }
        else {
            return lote_interface_1.StatusValidade.VALIDO;
        }
    }
};
exports.LoteService = LoteService;
exports.LoteService = LoteService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Lote')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => produto_service_1.ProdutoService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        produto_service_1.ProdutoService])
], LoteService);
//# sourceMappingURL=lote.service.js.map