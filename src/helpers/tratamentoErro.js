export function tratarErro(res, error) {
    if (error.cause === 404) {
        console.warn("🟡 " + error.message);
        return res.status(404).json({ mensagem: error.message });
    }
    if (error.cause) {
        console.error("🔴 " + error.message);
        return res.status(error.cause).json({ mensagem: error.message });
    }

    if (!error.cause) {
        const erroTratado = erroDeAcordoComMensagem(error.message);
        console.error("🟨 " + JSON.stringify(erroTratado));

        return res.status(erroTratado.status).json({ mensagem: erroTratado.message });
    }
}

function erroDeAcordoComMensagem(errorMessage) {
    console.error("🔴 " + errorMessage);
    if (errorMessage.includes("E11000 duplicate key error") && errorMessage.includes("codigoBarras")) {
        return {
            status: 400,
            message: "Já existe um produto com esse código de barras."
        }
    }
    if (errorMessage.includes("validation failed")) {
        return {
            status: 400,
            message: "Dados inválidos. Verifique os campos e tente novamente."
        }
    }
    return {
        status: 500,
        message: "Erro interno do servidor."
    }
}