import { forwardRef, Module } from '@nestjs/common';
import { DespensaController } from './despensa.controller';
import { DespensaService } from './despensa.service';
import { CasaModule } from '../casas/casa.module';

@Module({
  imports: [forwardRef(() => CasaModule)],
  controllers: [DespensaController],
  providers: [DespensaService],
  exports: [DespensaService],
})
export class DespensaModule {}
