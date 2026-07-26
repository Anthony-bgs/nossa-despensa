"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProdutoSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const produto_interface_1 = require("./produto.interface");
exports.ProdutoSchema = new mongoose_1.default.Schema({
    nome: { type: String, required: true },
    marca: { type: String, required: false },
    categoria: { type: String, required: true, enum: Object.values(produto_interface_1.Categoria) },
    grandeza: { type: String, required: true, enum: Object.values(produto_interface_1.Grandeza) },
    tamanhoPadrao: { type: Number, required: true },
    codigoBarras: { type: String, required: false, unique: true },
    localArmazenamento: { type: String, default: produto_interface_1.LocalArmazenamento.OUTRO, enum: Object.values(produto_interface_1.LocalArmazenamento) },
    status: { type: String, default: produto_interface_1.Status.EM_FALTA, enum: Object.values(produto_interface_1.Status) },
    estoqueTotal: { type: Number, default: 0 },
    lotes: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Lote' }],
    images: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Imagem' }],
}, { timestamps: true });
//# sourceMappingURL=produto.schema.js.map