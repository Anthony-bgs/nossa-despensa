import mongoose from 'mongoose';

const imagemSchema = new mongoose.Schema({
  produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  url: { type: String, required: true },
  width: { type: Number },
  height: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

imagemSchema.index({ produto: 1 });

const ImagemModel = mongoose.model('Imagem', imagemSchema);
export default ImagemModel;
