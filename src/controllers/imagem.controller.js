import { tratarErro } from "../helpers/tratamentoErro.js";
import service from "../services/imagem.service.js";

class ImagemController {
    //#region IMAGENS

    async adicionarImagem(req, res) {
        try {
            const imagem = await service.adicionarImagem(req.params.produtoID, req.file);
            res.status(201).json(imagem);
        } catch (error) {
            console.error('🔴 ERRO EM adicionarImagem ===>', error);
            return res.status(error.cause || 400).json({ menssagem: error.message || 'Erro ao adicionar imagem' });
        }
    }

    async listarImagens(req, res) {
        try {
            const imagens = await service.listarImagens(req.params.produtoID);
            res.json(imagens);
        } catch (error) {
            return tratarErro(res, error);
        }
    }

    async removerImagem(req, res) {
        try {
            const result = await service.removerImagem(req.params.produtoID, req.params.imagemID);
            res.json(result);
        } catch (error) {
            return tratarErro(res, error);
        }
    }

    //#endregion

}

export default new ImagemController();