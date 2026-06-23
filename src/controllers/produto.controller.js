import { tratarErro } from "../helpers/tratamentoErro.js";
import produtoService from "../services/produto.service.js";

class ProdutoController {

  //#region PRODUTOS

  // Criar produto
  async adicionarProduto(req, res) {
    try {
      const produto = await produtoService.criarProduto(req.body);
      res.status(201).json(produto);
    } catch (error) {
      return tratarErro(res, error);
    }
  }
  // Listar produtos
  async listarProdutos(req, res) {
    const produtos = await produtoService.listarProdutos();
    res.json(produtos);
  }
  // Listar produto por ID
  async listarProduto(req, res) {
    const produto = await produtoService.listarProdutoPorId(req.params.produtoID);
    res.json(produto);
  }
  // Atualizar produto
  async atualizarProduto(req, res) {
    try {
      const produto = await produtoService.atualizarProduto(req.params.produtoID, req.body);
      res.json(produto);
    } catch (error) {
      console.error("🔴 ERRO EM atualizarProduto ===> " + error);
      return res.status(400).json({ menssagem: 'Erro ao atualizar produto' });
    }
  }
  // Remover produto
  async removerProduto(req, res) {
    await produtoService.removerProduto(req.params.produtoID);
    res.status(204).send();
  }

  //#endregion

  //#region CONTROLE DE ESTOQUE

  // Listar produtos próximos do vencimento
  async produtosProximosDoVencimento(req, res) {
    const dias = parseInt(req.query.dias) || 7;
    const produtos = await produtoService.produtosProximosDoVencimento(dias);
    res.json(produtos);
  }
  // Listar produtos em falta
  async produtosEmFalta(req, res) {
    const produtos = await produtoService.produtosEmFalta();
    res.json(produtos);
  }
  // Listar produtos pela categoria
  async buscaPorCategoria(req, res) {
    const produtos = await produtoService.buscaPorCategoria(req.params.categoria);
    res.json(produtos);
  }
  //#endregion

}
export default new ProdutoController();
