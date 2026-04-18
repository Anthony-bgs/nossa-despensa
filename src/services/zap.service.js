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
            console.log("Produto:", produto);
            const nome = produto?.produto.nome || "Sem nome";
            const quantidade = produto?.quantidade ?? 0;
            const validade = produto?.validade || "sem validade";
            const status = produto?.produto.status || "sem status";
            const localarmazenamento = produto?.produto.localArmazenamento || "sem local de armazenamento";
            return `- ${nome} (quantidade: ${quantidade}, validade: ${validade.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' })}, status: ${status}, local: ${localarmazenamento})`;
        });

        return ["Lista da despensa:", ...linhas].join("\n");
    }

}
export default new ZapService();