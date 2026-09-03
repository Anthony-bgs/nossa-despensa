import { BadRequestException } from "@nestjs/common";
import { USUARIO_EMAIL, USUARIO_EMAIL_SENHA } from "../Helper/constantes";

export class EmailService {
    

async enviarEmail(destinatario: string, codigo: string): Promise<void> {
    const nodemailer = require('nodemailer');
// Configuração do transporte
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: USUARIO_EMAIL, 
    pass: USUARIO_EMAIL_SENHA
}
});

const mailOptions = {
  from: "decadente.romancista@gmail.com",
  to: destinatario, 
  subject: "código de convite",
  text: "seu código de convite é: " + codigo 
};

// Envio do e-mail
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    throw new BadRequestException("Erro ao enviar e-mail: " + error.message);
  }
return true;
});}}