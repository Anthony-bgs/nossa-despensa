import express from "express";
const router = express.Router();
import controller from '../controllers/produto.controller.js';

//#region PRODUTO
router.post('/', controller.adicionarProduto);
router.get('/', controller.listarProdutos);
router.get('/:produtoID', controller.listarProduto);
router.put('/:produtoID', controller.atualizarProduto);
router.delete('/:produtoID', controller.removerProduto);
//#endregion

//#region CONTROLE DE ESTOQUE
router.get('/status/proximos-do-vencimento', controller.produtosProximosDoVencimento);
router.get('/status/em-falta', controller.produtosEmFalta);
router.get('/categoria/:categoria', controller.buscaPorCategoria);
//#endregion

export default router;