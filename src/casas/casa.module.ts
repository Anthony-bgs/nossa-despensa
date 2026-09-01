import { Module } from '@nestjs/common';
import { CasaService } from './casa.service';
import { CasaController } from './casa.controller';
import { MembroCasaModule } from '../membros_casa/membro_casa.module';

@Module({
  imports: [MembroCasaModule],
  controllers: [CasaController],
  providers: [CasaService],
  exports: [CasaService],
})
export class CasaModule { }
