import { Body, Controller, Get, Param, Post, UseFilters, UseGuards } from '@nestjs/common';
import { LoteService } from './lote.service';
import type { AdicionarLoteDTO } from './lote.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('lotes')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post('/produto/:produtoId')
  @UseFilters(new HttpExceptionFilter())
  async adicionarLote(@Body() dados: AdicionarLoteDTO, @Param('produtoId') produtoId: string) {
    try {
      return await this.loteService.adicionarLote(dados, produtoId);
    } catch (error) {
      throw error;
    }
  }
}
