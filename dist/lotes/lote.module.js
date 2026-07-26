"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const lote_schema_1 = require("./lote.schema");
const lote_service_1 = require("./lote.service");
const lote_controller_1 = require("./lote.controller");
const produto_module_1 = require("../produtos/produto.module");
let LoteModule = class LoteModule {
};
exports.LoteModule = LoteModule;
exports.LoteModule = LoteModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: 'Lote', schema: lote_schema_1.LoteSchema }]),
            (0, common_1.forwardRef)(() => produto_module_1.ProdutoModule),
        ],
        controllers: [lote_controller_1.LoteController],
        providers: [lote_service_1.LoteService],
        exports: [lote_service_1.LoteService],
    })
], LoteModule);
//# sourceMappingURL=lote.module.js.map