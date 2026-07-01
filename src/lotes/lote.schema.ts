import mongoose from 'mongoose';
import { Status, StatusValidade } from './lote.interface';

export const LoteSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  quantidade: { type: Number, required: true },
  validade: { type: Date , required: false, default: null },
  status: { type: String, default: Status.FECHADO, required: true, enum: Object.values(Status) },
  statusValidade: { type: String, default: StatusValidade.VALIDO, required: true, enum: Object.values(StatusValidade) }
}, { timestamps: true });
