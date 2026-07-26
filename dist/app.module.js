"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const produto_module_1 = require("./produtos/produto.module");
const lote_module_1 = require("./lotes/lote.module");
const constants_1 = require("@nestjs/core/constants");
const http_exception_filter_1 = require("./filters/http-exception.filter");
const auth_module_1 = require("./auth/auth.module");
const usuarios_module_1 = require("./usuarios/usuarios.module");
const constantes_1 = require("./Helper/constantes");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(constantes_1.MONGO_URI),
            produto_module_1.ProdutoModule,
            lote_module_1.LoteModule,
            auth_module_1.AuthModule,
            usuarios_module_1.UsuariosModule,
        ],
        controllers: [],
        providers: [
            {
                provide: constants_1.APP_FILTER,
                useClass: http_exception_filter_1.HttpExceptionFilter,
            }
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map