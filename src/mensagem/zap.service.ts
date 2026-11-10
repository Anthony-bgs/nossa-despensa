import { BadRequestException, Injectable } from '@nestjs/common';
import {
  WHATSAPP_ACCESS_TOKEN,
  WHATSAPP_API_VERSION,
  WHATSAPP_PHONE_NUMBER_ID,
} from '../Helper/constantes';

interface WhatsAppResponse {
  error?: {
    message?: unknown;
  };
}

@Injectable()
export class ZapService {
  async enviarMensagemZap(destinatario: string, codigo: string): Promise<void> {
    if (!destinatario || !codigo) {
      throw new BadRequestException('Destinatário e código são obrigatórios');
    }

    const url = `https://graph.facebook.com/${WHATSAPP_API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
    const headers = {
      Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    };
    const body = {
      messaging_product: 'whatsapp',
      to: destinatario.replace(/\D/g, ''),
      type: 'text',
      text: {
        body: `Seu código de convite é: ${codigo}`,
      },
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    const data = (await response.json()) as WhatsAppResponse;

    if (!response.ok) {
      const message =
        typeof data.error?.message === 'string'
          ? data.error.message
          : `HTTP ${response.status}`;
      throw new BadRequestException(
        `Erro ao enviar mensagem pelo WhatsApp: ${message}`,
      );
    }
  }
}
