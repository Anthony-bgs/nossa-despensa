import { tratarErro } from "../helpers/tratamentoErro.js";
import loteService from "../services/lote.service.js";

class LoteController {

  async adicionarLote(req, res) {
    try {
      const lote = await loteService.adicionarLote(req.params.produtoID, req.body);
      res.status(201).json(lote);
    } catch (error) {
      console.error('🔴 Erro ao adicionar lote:', error.message);
      res.status(error.cause || 500).json({
        mensagem: error.cause === 400 ? 'Dados de lote inválidos' : 'Erro ao adicionar lote',
        detalhe: error.message
      });
    }
  }

  async atualizarLote(req, res) {
    try {
      const lote = await loteService.atualizarLote(req.params.loteID, req.body);
      res.json(lote);
    } catch (error) {
      console.error("🔴 ERRO EM atualizarLote ===> " + error);
      return res.status(400).json({ menssagem: 'Erro ao atualizar lote' });
    }
  }

  async listarLotes(req, res) {
    try {
      const lotes = await loteService.listarLotesPorProduto(req.params.produtoID);
      res.json(lotes);
    } catch (error) {
      return tratarErro(res, error);
    }
  }

  async listarLotePorNumero(req, res) {
    try {
      const lote = await loteService.listarLotePorNumero(req.params.loteNumero);
      res.json(lote);
    } catch (error) {
      return tratarErro(res, error);
    }
  }

  async removerLote(req, res) {
    try {
      const result = await loteService.removerLote(req.params.loteID);
      res.json(result);
    } catch (error) {
      return tratarErro(res, error);
    }
  }

  async definirStatusLote(req, res) {
    try {
      const lote = await loteService.definirStatusLote(req.params.loteID, req.body.status);
      res.json(lote);
    } catch (error) {
      return tratarErro(res, error);
    }
  }

}

export default new LoteController();