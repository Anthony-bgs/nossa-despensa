import mongoose from 'mongoose';
import { StatusLote } from '../helpers/produto.enum.js';

const loteSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  quantidade: { type: Number, required: true },
  validade: { type: Date , required: false, default: null },
  status: { type: String, default: StatusLote.FECHADO, enum: Object.values(StatusLote) }
}, { timestamps: true });

loteSchema.index({ produto: 1, validade: 1 });

const LoteModel = mongoose.model('Lote', loteSchema);
export default LoteModel;