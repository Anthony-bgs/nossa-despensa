import { Module } from '@nestjs/common';
import { LocalArmazenamentoController } from './local-armazenamento.controller';
import { LocalArmazenamentoService } from './local-armazenamento.service';

@Module({
  controllers: [LocalArmazenamentoController],
  providers: [LocalArmazenamentoService],
  exports: [LocalArmazenamentoService],
})
export class LocalArmazenamentoModule {}
