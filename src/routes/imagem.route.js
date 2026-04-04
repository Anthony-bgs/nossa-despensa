const router = express.Router();
import express from 'express';
import multer from 'multer';
import controller from '../controllers/imagem.controller.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

//#region IMAGENS
router.post('/produtos/:produtoID', upload.single('imagem'), controller.adicionarImagem);
router.get('/produtos/:produtoID', controller.listarImagens);
router.delete('/produtos/:produtoID/:imagemID', controller.removerImagem);
//#endregion

export default router;