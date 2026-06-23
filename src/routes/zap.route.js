import express from "express";
const router = express.Router();
import controller from '../controllers/zap.controller.js';

router.get('/enviar-lista-zap', controller.enviarListaZap);

export default router;