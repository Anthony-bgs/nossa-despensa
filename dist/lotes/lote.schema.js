"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoteSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const lote_interface_1 = require("./lote.interface");
exports.LoteSchema = new mongoose_1.default.Schema({
    produto: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Produto', required: true },
    quantidade: { type: Number, required: true },
    validade: { type: Date, required: false, default: null },
    status: { type: String, default: lote_interface_1.Status.FECHADO, required: true, enum: Object.values(lote_interface_1.Status) },
    statusValidade: { type: String, default: lote_interface_1.StatusValidade.VALIDO, required: true, enum: Object.values(lote_interface_1.StatusValidade) }
}, { timestamps: true });
//# sourceMappingURL=lote.schema.js.map