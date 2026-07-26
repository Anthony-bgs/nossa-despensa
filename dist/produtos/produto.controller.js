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
exports.ProdutoController = void 0;
const common_1 = require("@nestjs/common");
const produto_service_1 = require("./produto.service");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const auth_guard_1 = require("../auth/auth.guard");
let ProdutoController = class ProdutoController {
    produtoService;
    constructor(produtoService) {
        this.produtoService = produtoService;
    }
    async novoProduto(dados) {
        try {
            return await this.produtoService.novoProduto(dados);
        }
        catch (error) {
            common_1.Logger.error('Erro ao criar produto:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async buscarTodosProdutos(query, request) {
        try {
            const { limite, pule, pagina, ...filtro } = query ?? {};
            const paginacao = {
                limite: limite !== undefined ? Number(limite) : undefined,
                pagina: pagina !== undefined ? Number(pagina) - 1 : 0,
            };
            return this.produtoService.buscarTodosProdutos(filtro, paginacao);
        }
        catch (error) {
            common_1.Logger.error('Erro ao buscar produtos:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async buscarProdutoPorId(id) {
        const produto = await this.produtoService.buscarProdutoPorId(id);
        if (!produto) {
            throw new common_1.NotFoundException('Produto nao encontrado');
        }
        return produto;
    }
    async atualizarProduto(dados, id) {
        try {
            await this.produtoService.atualizarProduto(id, dados);
        }
        catch (error) {
            common_1.Logger.error('Erro ao atualizar produto:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deletarProduto(id) {
        try {
            const produtoDeletado = await this.produtoService.deletarProduto(id);
            if (!produtoDeletado) {
                throw new common_1.NotFoundException('Produto nao encontrado');
            }
        }
        catch (error) {
            common_1.Logger.error('Erro ao deletar produto:', error);
            throw new common_1.BadRequestException(error.message);
        }
    }
};
exports.ProdutoController = ProdutoController;
__decorate([
    (0, common_1.Post)('/'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "novoProduto", null);
__decorate([
    (0, common_1.Get)('/'),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "buscarTodosProdutos", null);
__decorate([
    (0, common_1.Get)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "buscarProdutoPorId", null);
__decorate([
    (0, common_1.Put)('/:id'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "atualizarProduto", null);
__decorate([
    (0, common_1.Delete)('/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProdutoController.prototype, "deletarProduto", null);
exports.ProdutoController = ProdutoController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('produtos'),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionFilter()),
    __metadata("design:paramtypes", [produto_service_1.ProdutoService])
], ProdutoController);
//# sourceMappingURL=produto.controller.js.map