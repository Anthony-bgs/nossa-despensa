import { StatusProduto, CategoriasProduto, GrandezasProduto } from '../helpers/produto.enum.js';
import model from '../models/produto.model.js';
import loteService from './lote.service.js';

class ProdutoService {
  //#region PRODUTOS
  // Criar novo produto
  async criarProduto(dados) {
    const novoProduto = new model({
      ...dados,
      nome: dados.nome.toLowerCase(),
      marca: dados.marca.toLowerCase(),
      categoria: CategoriasProduto[dados.categoria],
      grandeza: GrandezasProduto[dados.grandeza]
    });
    return await novoProduto.save();
  }
  // Listar todos os produtos
  async listarProdutos(filtro) {
    let letra=filtro.nome
    if(filtro.nome) {
      return await model.find({ nome: { $regex: letra, $options: 'i' } }).sort({ nome: 1 }).select("nome marca categoria grandeza status estoqueTotal images").populate('images', 'url');
    }

    return await model.find(...filtro).sort({ nome: 1 }).select("nome marca categoria grandeza status estoqueTotal images").populate('images', 'url');
  }
  // Listar produto por ID
  async listarProdutoPorId(id) {
    return await model.findById(id).populate('lotes');
  }
  // Atualizar produto
  async atualizarProduto(id, dados){
    if (dados.nome) dados.nome = dados.nome.toLowerCase();
    if (dados.marca) dados.marca = dados.marca.toLowerCase();
    return await model.findByIdAndUpdate(id, dados, { returnDocument: 'after' });
  }
  // Remover produto
  async removerProduto(id) {
    await loteService.removerLotesPorProduto(id);
    return await model.findByIdAndDelete(id);
  }

  //#endregion

  //#region CONTROLE DE ESTOQUE

  // Buscar produtos próximos do vencimento
  async produtosProximosDoVencimento(dias) {
    const lotesProximos = await loteService.lotesProximosDoVencimento(dias);

    // Retornar produtos únicos
    const produtosIds = [...new Set(lotesProximos.map(l => l.produto._id.toString()))];
    return await model.find({ _id: { $in: produtosIds }, status: StatusProduto.EM_ESTOQUE });
  }

  // Buscar produtos em falta
  async produtosEmFalta() {
    return await model.find({ status: StatusProduto.EM_FALTA });
  }

  // Buscar produtos pela categoria
  async buscaPorCategoria(categoria) {
    return await model.find({ categoria: CategoriasProduto[String(categoria).toUpperCase()] });
  }
  
  //#endregion
  
  //#region MÉTODOS AUXILIARES EXTERNOS
  async _buscarProdutoPorId(id) {
    const produto = await model.findById(id);
    if (!produto) {
      throw new Error('Produto não encontrado', { cause: 404 });
    }
    return produto;
  }
  //#endregion
}


export default new ProdutoService();
