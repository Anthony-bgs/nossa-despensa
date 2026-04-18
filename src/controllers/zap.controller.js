import { tratarErro } from "../helpers/tratamentoErro.js";
import produtoService from "../services/produto.service.js";
import zapService from "../services/zap.service.js";

class ZapController {
    async enviarListaZap(req, res) {
        try {
            const produtos = await produtoService.listarProdutos(status);
            const envio = await zapService.MandarMensagem(produtos);
            res.json({ message: "Lista enviada para o WhatsApp!", envio });
        } catch (error) {
            return tratarErro(res, error);
        }
    }
}

export default new ZapController();
