import { Body, Controller, Delete, Get, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { LoteService } from './lote.service';
import type { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
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
      await this.loteService.adicionarLote(dados, produtoId);
      return (produtoId)
    } catch (error) {
      throw error;
    }
  }

  @Put('/produto/:produtoId/lote/:loteId')
  @UseFilters(new HttpExceptionFilter())
  async atualizarLote(@Body() dados: AtualizarLoteDTO, @Param('produtoId') produtoId: string, @Param('loteId') loteId: string) {
  }

  @Delete('/:loteId')
  @UseFilters(new HttpExceptionFilter())
  async deletarLote(@Param('loteId') loteId: string) {
} 
}
