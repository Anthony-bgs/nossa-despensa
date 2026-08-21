import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { LoteService } from './lote.service';
import type { AdicionarLoteDTO, AtualizarLoteDTO } from './lote.dto';
import type { Lote } from './lote.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('lotes')
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post('/:idProdutoDespensa')
  
  async adicionarLote(@Body() dados: AdicionarLoteDTO, @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number): Promise<Lote> {
    return await this.loteService.adicionarLote(dados, idProdutoDespensa);
  }
  @Delete('deletarlotes/:id')
  async deletarLotePorPoduto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.loteService.deletarLotePorProduto(id);
    return;
  }

  @Get('/produto-despensa/:idProdutoDespensa')
  async listarPorProdutoDespensa(
    @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number,
  ): Promise<Lote[]> {
    return await this.loteService.listarPorProdutoDespensa(idProdutoDespensa);
  }
  @Get('/estoque-total/:idProdutoDespensa')
  async calcularEstoqueTotalDosLotesPorProdutoDespensa(
    @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number,
  ): Promise<number> {
    return await this.loteService.calcularEstoqueTotalDosLotesPorProdutoDespensa(idProdutoDespensa);
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Lote> {
    const lote = await this.loteService.buscarLotePorId(id);
    if (!lote) {
      throw new Error('Lote não encontrado');
    }
    return lote;
  }

  @Put(':id')
  async atualizarLote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarLoteDTO,
  ): Promise<Lote> {
    return await this.loteService.atualizarLote(id, dados);
  }

  @Delete(':id')
  async deletarLote(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.loteService.deletarLote(id);
  }
}
