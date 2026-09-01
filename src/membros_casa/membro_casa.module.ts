import { Module } from '@nestjs/common';
import { MembroCasaService } from './membro_casa.service';
import { MembroCasaController } from './membro_casa.controller';
import { EmailService } from '../mensagem/email.service';

@Module({
  imports: [],
  controllers: [MembroCasaController],
  providers: [MembroCasaService, EmailService],
  exports: [MembroCasaService],
})
export class MembroCasaModule { }
