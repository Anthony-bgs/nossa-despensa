import mongoose from "mongoose";
import { Categoria, Grandeza, LocalArmazenamento, Status } from "./produto.interface";

export const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  marca: { type: String, required: false },
  categoria:  { type: String, required:true, enum: Object.values(Categoria) },
  grandeza: { type: String, required:true, enum: Object.values(Grandeza) },
  tamanhoPadrao: { type: Number, required: true },
  codigoBarras: { type: String, required: false, unique: true },
  localArmazenamento: { type: String, default: LocalArmazenamento.OUTRO, enum: Object.values(LocalArmazenamento) },
  status: { type: String, default: Status.EM_FALTA, enum: Object.values(Status) },
  estoqueTotal: { type: Number, default: 0 },
  lotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lote' }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Imagem' }],
}, {timestamps: true });
