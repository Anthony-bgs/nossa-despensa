import { Module } from '@nestjs/common';
import { MembroCasaService } from './membro_casa.service';
import { MembroCasaController } from './membro_casa.controller';

@Module({
  imports: [],
  controllers: [MembroCasaController],
  providers: [MembroCasaService],
  exports: [MembroCasaService],
})
export class MembroCasaModule { }
