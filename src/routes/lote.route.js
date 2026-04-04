import express from 'express';
import loteController from '../controllers/lote.controller.js';

const router = express.Router();

//#region LOTES
router.post('/:produtoID/lotes', loteController.adicionarLote);
router.get('/:produtoID/lotes', loteController.listarLotes);
router.get('/lotes/:loteNumero', loteController.listarLotePorNumero);
router.put('/lotes/:loteID', loteController.atualizarLote);
router.delete('/lotes/:loteID', loteController.removerLote);
router.put('/lotes/:loteID/status', loteController.definirStatusLote);
//#endregion

export default router;
