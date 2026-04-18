class ZapService {

    async MandarMensagem(produtos) {
        const token = process.env.TOKEN_ZAP;
        const phoneNumberId = process.env.PHONE_NUMBER_ID_ZAP;
        const destinatario = process.env.DESTINATARIO_ZAP;

        if (!token) {
            throw new Error("TOKEN_ZAP nao configurado", { cause: 500 });
        }

        if (!phoneNumberId) {
            throw new Error("PHONE_NUMBER_ID_ZAP nao configurado", { cause: 500 });
        }

        if (!destinatario) {
            throw new Error("DESTINATARIO_ZAP nao configurado", { cause: 400 });
        }

        const url = `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`;
        const mensagem = this._montarMensagemLista(produtos);

        const body = {
            messaging_product: "whatsapp",
            to: destinatario,
            type: "text",
            text: {
                body: mensagem
            }
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            const mensagemErro = data?.error?.message || "Falha no envio para WhatsApp";
            throw new Error(mensagemErro, { cause: response.status });
        }

        return data;
    }

    _montarMensagemLista(produtos) {
        if (!Array.isArray(produtos) || produtos.length === 0) {
            return "Lista da despensa vazia no momento.";
        }

        const linhas = produtos.map((produto) => {
            const nome = produto?.nome || "Sem nome";
            const estoque = produto?.estoqueTotal ?? 0;
            return `- ${nome} (estoque: ${estoque})`;
        });

        return ["Lista da despensa:", ...linhas].join("\n");
    }

}
export default new ZapService();