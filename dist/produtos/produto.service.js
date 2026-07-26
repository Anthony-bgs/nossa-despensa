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
exports.ProdutoService = void 0;
const common_1 = require("@nestjs/common");
const produto_interface_1 = require("./produto.interface");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const lote_service_1 = require("../lotes/lote.service");
const constantes_1 = require("../Helper/constantes");
let ProdutoService = class ProdutoService {
    produtoModel;
    loteService;
    constructor(produtoModel, loteService) {
        this.produtoModel = produtoModel;
        this.loteService = loteService;
    }
    async novoProduto(dados) {
        const novoProduto = new this.produtoModel({
            ...dados,
            nome: dados.nome.toLowerCase(),
            marca: dados.marca.toLowerCase(),
            categoria: produto_interface_1.Categoria[dados.categoria],
            grandeza: produto_interface_1.Grandeza[dados.grandeza],
            localArmazenamento: produto_interface_1.LocalArmazenamento[dados.localArmazenamento],
        });
        const produtoSalvo = await novoProduto.save();
        return produtoSalvo._id;
    }
    async buscarTodosProdutos(filtro, paginacao) {
        const { categoria, codigoBarras, filtroValidade, localArmazenamento, nome } = filtro ?? {};
        const filtroProduto = {};
        if (categoria)
            filtroProduto.categoria = produto_interface_1.Categoria[categoria];
        if (codigoBarras)
            filtroProduto.codigoBarras = codigoBarras;
        if (localArmazenamento)
            filtroProduto.localArmazenamento = produto_interface_1.LocalArmazenamento[localArmazenamento];
        if (nome)
            filtroProduto.nome = new RegExp(nome, 'i');
        const { limite, pule } = this.configurarPaginacao(paginacao);
        let produtos = await this.produtoModel.find(filtroProduto, null, { skip: pule, limit: limite }).collation({ locale: 'pt', strength: 2 }).sort({ nome: 1 }).populate("lotes", "validade");
        let total = await this.produtoModel.countDocuments(filtroProduto);
        if (filtroValidade) {
            let dataHoje = new Date();
            let dataFinal = new Date();
            dataFinal.setDate(dataHoje.getDate() + Number(filtroValidade));
            produtos = produtos.filter((produto) => {
                produto.lotes = produto.lotes.filter((lote) => {
                    return lote.validade <= dataFinal;
                });
                return produto.lotes.length > 0;
            });
        }
        return { produtos, paginacao: { total: this.configurarPaginacaoResponse(total).totalPaginas } };
    }
    async buscarProdutoPorId(id) {
        return await this.produtoModel.findById(id).populate("lotes", "validade quantidade status statusValidade");
    }
    async adicionarLote(_id, lote, estoqueTotal) {
        const status = estoqueTotal > 0 ? produto_interface_1.Status.EM_ESTOQUE : produto_interface_1.Status.EM_FALTA;
        await this.produtoModel.findByIdAndUpdate(_id, { $push: { lotes: lote._id }, $set: { estoqueTotal, status } }, { new: true });
    }
    async atualizarProduto(_id, dados) {
        if (dados.nome)
            dados.nome = dados.nome.toLowerCase();
        if (dados.marca)
            dados.marca = dados.marca.toLowerCase();
        return await this.produtoModel.findOneAndUpdate({ _id }, { ...dados });
    }
    async deletarProduto(_id) {
        await this.loteService.deletarLotePorProduto(_id);
        return await this.produtoModel.findByIdAndDelete(_id);
    }
    async deletarLoteDoProduto(produtoId, loteId) {
        const produto = await this.produtoModel.findById(produtoId);
    }
    async buscarProdutoParaEstoqueTotal(produtoId) {
        const produto = await this.produtoModel.findById(produtoId);
        return produto;
    }
    async removerLote(produtoId, loteId, novoEstoqueTotal) {
        await this.atualizarEstoqueTotal(produtoId, novoEstoqueTotal);
        await this.produtoModel.findByIdAndUpdate(produtoId, { $pull: { lotes: loteId } }, { new: true });
    }
    async atualizarEstoqueTotal(produtoId, estoqueTotal) {
        const status = estoqueTotal > 0 ? produto_interface_1.Status.EM_ESTOQUE : produto_interface_1.Status.EM_FALTA;
        await this.produtoModel.findByIdAndUpdate(produtoId, { $set: { estoqueTotal, status } }, { new: true });
    }
    configurarPaginacao(paginacao) {
        const limite = paginacao?.limite ?? constantes_1.TAMANHO_PAGINA_PADRAO;
        const pagina = paginacao?.pagina ?? 0;
        const pule = pagina * limite;
        return { limite, pule };
    }
    configurarPaginacaoResponse(quantidadeProdutos) {
        const totalPaginas = Math.ceil(quantidadeProdutos / constantes_1.TAMANHO_PAGINA_PADRAO);
        return { totalPaginas };
    }
};
exports.ProdutoService = ProdutoService;
exports.ProdutoService = ProdutoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Produto')),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => lote_service_1.LoteService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        lote_service_1.LoteService])
], ProdutoService);
//# sourceMappingURL=produto.service.js.map