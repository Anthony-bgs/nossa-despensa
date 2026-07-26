"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.UsuarioSchema = new mongoose_1.default.Schema({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    senha: { type: String, required: true },
}, { timestamps: true });
//# sourceMappingURL=usuarios.schema.js.map