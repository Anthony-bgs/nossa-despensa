import { Module } from '@nestjs/common';
import { DespensaController } from './despensa.controller';
import { DespensaService } from './despensa.service';

@Module({
  controllers: [DespensaController],
  providers: [DespensaService],
  exports: [DespensaService],
})
export class DespensaModule {}
