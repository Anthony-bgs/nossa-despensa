import mongoose from 'mongoose';
import { StatusProduto, CategoriasProduto, GrandezasProduto, LocalizacaoProduto } from '../helpers/produto.enum.js';

const produtoSchema = new mongoose.Schema({
  nome: { type: String, required: true},
  marca: { type: String, required: false },
  categoria:  { type: String, required:true, enum: Object.values(CategoriasProduto) },
  grandeza: { type: String, required:true, enum: Object.values(GrandezasProduto) },
  tamanhoPadrao: { type: Number, required: true },
  codigoBarras: { type: String, required: false, unique: true },
  localArmazenamento: { type: String, default: LocalizacaoProduto.OUTRO, enum: Object.values(LocalizacaoProduto) },
  status: { type: String, default: StatusProduto.EM_FALTA, enum: Object.values(StatusProduto) },
  estoqueTotal: { type: Number, default: 0 },
  lotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lote' }],
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Imagem' }],
}, {timestamps: true });

// Isso cria a coleção "produtos" dentro do banco nossa-despensa
const ProdutoModel = mongoose.model('Produto', produtoSchema);
export default ProdutoModel;