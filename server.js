import "dotenv/config";
import app from "./src/app.js";
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);

}).on('error', (err) => {
  console.error('Erro ao iniciar o servidor:', err.message);
  process.exit(1);
});
