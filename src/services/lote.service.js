import { StatusProduto, StatusLote } from '../helpers/produto.enum.js';
import loteModel from '../models/lote.model.js';
import produtoModel from '../models/produto.model.js';
import {ConstantesHelper} from '../helpers/constantes.helper.js';

class LoteService {

  // Adicionar novo lote a um produto existente
  async adicionarLote(produtoId, dadosLote) {
    const produto = await produtoModel.findById(produtoId);
    if (!produto) {
      throw new Error('Produto não encontrado', { cause: 404 });
    }
    const lote = await loteModel.create({
      ...dadosLote,
      produto: produtoId,
    });


    produto.lotes.push(lote._id);
    produto.status = StatusProduto.EM_ESTOQUE;
    await produto.save();

    return lote;
  }

  // Listar os lotes de um produto específico
  async listarLotesPorProduto(produtoId) {
    await _buscarProdutoPorId(produtoId);
    return await loteModel.find({ produto: produtoId }).sort({ validade: 1 });
  }

  // Listar lote por ID
  async listarLotePorId(loteId) {
    const lote = await loteModel.findById(loteId).populate('produto');
    if (!lote) {
      throw new Error('Lote não encontrado', { cause: 404 });
    }
    return lote;
  }

  // Buscar lote por ID
  async buscarLotePorId(loteId) {
    const lote = await loteModel.findById(loteId).populate('produto');
    if (!lote) {
      throw new Error('Lote não encontrado', { cause: 404 });
    }
    return lote;
  }

  // Atualizar lote específico
  async atualizarLote(loteId, dadosLote) {
    const lote = await loteModel.findById(loteId);

    if (!lote) {
      throw new Error('Lote não encontrado', { cause: 404 });
    }

    Object.assign(lote, dadosLote);
    await lote.save();

    // Verificar se o produto ainda tem estoque após a atualização do lote (considerando a quantidade do lote atualizado)
    await controlarEstoqueTotal(lote);

    return lote;
  }

  // Remover lote específico
  async removerLote(loteId) {
    const lote = await loteModel.findById(loteId);
    if (!lote) {
      throw new Error('Lote não encontrado', { cause: 404 });
    }

    await loteModel.findByIdAndDelete(loteId);
    await produtoModel.findByIdAndUpdate(lote.produto, { $pull: { lotes: loteId } });

    await controlarEstoqueTotal(lote);
    

    return { mensagem: 'Lote removido com sucesso' };
  }

  // Buscar lotes próximos do vencimento
  async lotesProximosDoVencimento(dias) {
    const limite = new Date();
    limite.setDate(limite.getDate() + dias);

    return await loteModel.find({
      validade: { $ne: null, $lte: limite },
      quantidade: { $gt: 0 }
    }).populate('produto').sort({ validade: 1 });
  }

  // Definir status de um lote
  async definirStatusLote(loteId, status) {
    const lote = await loteModel.findById(loteId);
    if (!lote) {
      throw new Error('Lote não encontrado', { cause: 404 });
    }

    if (!Object.values(StatusLote).includes(status)) {
      throw new Error('Status inválido', { cause: 400 });
    }

    lote.status = status;
    return await lote.save();
  }

  // Buscar lotes por produto e status
  async buscarLotesPorProdutoEStatus(produtoId, status) {
    return await loteModel.find({
      produto: produtoId,
      status: status
    }).sort({ validade: 1 });
  }



  async removerLotesPorProduto(produtoId) {
    await loteModel.deleteMany({ produto: produtoId });
  }
  async listarVencimento() {
    let datamaxima = new Date();
    datamaxima.setDate(datamaxima.getDate() + ConstantesHelper.FILTRO_DATA);
    let data = new Date();
    return await loteModel.find({ validade: { $lte: datamaxima}, quantidade: { $gt: 0 } }).populate('produto').sort({ validade: 1 });
  }
}
// Método auxiliar
async function _buscarProdutoPorId(id) {
  const produto = await produtoModel.findById(id);
  if (!produto) {
    throw new Error('Produto não encontrado', { cause: 404 });
  }
  return produto;
}

// Calcular estoque total de um produto
async function controlarEstoqueTotal(lote) {
  const outrosLotes = await loteModel.countDocuments({
    produto: lote.produto,
    quantidade: { $gt: 0 }
  });


  if (outrosLotes === 0) {
    await produtoModel.findByIdAndUpdate(lote.produto, { status: StatusProduto.EM_FALTA, estoqueTotal: 0 });
  } else {
    const result = await loteModel.aggregate([
      { $match: { produto: lote.produto } },
      { $group: { _id: null, total: { $sum: '$quantidade' } } }
    ]);
    const estoqueTotal = result.length > 0 ? result[0].total : 0;

    await produtoModel.findByIdAndUpdate(lote.produto, { status: StatusProduto.EM_ESTOQUE, estoqueTotal: estoqueTotal });
  }
}

export default new LoteService();