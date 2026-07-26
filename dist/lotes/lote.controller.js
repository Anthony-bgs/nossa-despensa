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
exports.LoteController = void 0;
const common_1 = require("@nestjs/common");
const lote_service_1 = require("./lote.service");
const http_exception_filter_1 = require("../filters/http-exception.filter");
const auth_guard_1 = require("../auth/auth.guard");
let LoteController = class LoteController {
    loteService;
    constructor(loteService) {
        this.loteService = loteService;
    }
    async adicionarLote(dados, produtoId) {
        try {
            await this.loteService.adicionarLote(dados, produtoId);
            return (produtoId);
        }
        catch (error) {
            throw error;
        }
    }
    async atualizarLote(dados, produtoId, loteId) {
    }
    async deletarLote(loteId) {
    }
};
exports.LoteController = LoteController;
__decorate([
    (0, common_1.Post)('/produto/:produtoId'),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('produtoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], LoteController.prototype, "adicionarLote", null);
__decorate([
    (0, common_1.Put)('/produto/:produtoId/lote/:loteId'),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('produtoId')),
    __param(2, (0, common_1.Param)('loteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], LoteController.prototype, "atualizarLote", null);
__decorate([
    (0, common_1.Delete)('/:loteId'),
    (0, common_1.UseFilters)(new http_exception_filter_1.HttpExceptionFilter()),
    __param(0, (0, common_1.Param)('loteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LoteController.prototype, "deletarLote", null);
exports.LoteController = LoteController = __decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('lotes'),
    __metadata("design:paramtypes", [lote_service_1.LoteService])
], LoteController);
//# sourceMappingURL=lote.controller.js.map