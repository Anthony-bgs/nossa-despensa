import "dotenv/config";
import express from 'express';
import app from "./src/app.js";
const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);

}).on('error', (err) => {
  console.error('Erro ao iniciar o servidor:', err.message);
  process.exit(1);
});
