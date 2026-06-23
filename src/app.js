
import express from 'express';
import cors from 'cors';
import path from 'path';
import produtoRoutes from './routes/produto.route.js';
import loteRoutes from './routes/lote.route.js';
import imagemRoutes from './routes/imagem.route.js';
import connectDB from './config/db.js';
import zapRoutes from './routes/zap.route.js';
connectDB();

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || '')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(cors({
	origin: allowedOrigins.length > 0 ? allowedOrigins : true,
	credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rotas principais
app.use('/produtos', produtoRoutes);
app.use('/produtos', loteRoutes);
app.use('/imagens', imagemRoutes);
app.use('/zap', zapRoutes);
export default app;