
import express from 'express';
import cors from 'cors';
import path from 'path';
import produtoRoutes from './routes/produto.route.js';
import loteRoutes from './routes/lote.route.js';
import imagemRoutes from './routes/imagem.route.js';
import connectDB from './config/db.js';
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rotas principais
app.use('/produtos', produtoRoutes);
app.use('/produtos', loteRoutes);
app.use('/imagens', imagemRoutes);

export default app;