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
        console.error("🔴 " + error.message);
        return res.status(500).json({ mensagem: error.message });
    }
}