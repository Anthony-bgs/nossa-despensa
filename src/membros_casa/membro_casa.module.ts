import { forwardRef, Module } from '@nestjs/common';
import { MembroCasaService } from './membro_casa.service';
import { MembroCasaController } from './membro_casa.controller';
import { EmailService } from '../mensagem/email.service';
import { CasaService } from '../casas/casa.service';
import { CasaModule } from '../casas/casa.module';
import { ZapService } from '../mensagem/zap.service';

@Module({
  imports: [forwardRef(() => CasaModule)],
  controllers: [MembroCasaController],
  providers: [MembroCasaService, EmailService, ZapService],
  exports: [MembroCasaService],
})
export class MembroCasaModule { }
