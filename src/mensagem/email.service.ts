import { EmailDTO } from "../casas/casa.dto";
import { USUARIO_EMAIL, USUARIO_EMAIL_SENHA } from "../Helper/constantes";

export class EmailService {
    

async enviarEmail(dados: EmailDTO): Promise<void> {
    const nodemailer = require('nodemailer');
// Configuração do transporte
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true para porta 465, false para outras portas
  auth: {
    user: USUARIO_EMAIL, // seu e-mail
    pass: USUARIO_EMAIL_SENHA
}
});

// Configuração da mensagem
const mailOptions = {
  from: dados.email, // seu e-mail
  to: dados.destinatario, // e-mail do destinatário
  subject: dados.assunto,
  text: dados.mensagem
};

// Envio do e-mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log('Erro ao enviar: ', error);
  }
  console.log('E-mail enviado com sucesso: ' + info.response);
});}}