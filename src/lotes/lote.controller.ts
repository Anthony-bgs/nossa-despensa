import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { LoteService } from './lote.service';
import type { AdicionarLoteDTO, AtualizarLoteDTO, DeletarLoteDTO } from './lote.dto';
import type { Lote } from './lote.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('lotes')
@UseFilters(new HttpExceptionFilter())
export class LoteController {
  constructor(private readonly loteService: LoteService) {}

  @Post('/adicionar')
  
  async adicionarLote(@Body() dados: AdicionarLoteDTO,@Request() req): Promise<Lote> {
    return await this.loteService.adicionarLote(dados, req?.usuario?.sub);
  }
  @Delete('deletarlotesproduto/:idProdutoDespensa')
  async deletarLotePorPoduto(@Request() req: any, @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number): Promise<void> {
    try {
      await this.loteService.deletarLotePorProduto(idProdutoDespensa, req?.usuario?.sub);
      return;
    } catch (error) {
      throw error;
    }
  }

  @Get('/produto-despensa/:idProdutoDespensa')
  async listarPorProdutoDespensa(
    @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number,
  ): Promise<Lote[]> {
    try {
      return await this.loteService.listarPorProdutoDespensa(idProdutoDespensa);
    } catch (error) {
      throw error;
    }
  }
  @Get('/estoque-total/:idProdutoDespensa')
  async calcularEstoqueTotalDosLotesPorProdutoDespensa(
    @Param('idProdutoDespensa', ParseIntPipe) idProdutoDespensa: number,
  ): Promise<number> {
    try {
      return await this.loteService.calcularEstoqueTotalDosLotesPorProdutoDespensa(idProdutoDespensa);
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Lote> {
    try {
      const lote = await this.loteService.buscarLotePorId(id);
    if (!lote) {
      throw new Error('Lote não encontrado');
    }
    return lote;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async atualizarLote(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarLoteDTO,
  ): Promise<Lote> {
    try {  return await this.loteService.atualizarLote(id, dados);
    } catch (error) {
      throw error;
    }
  }

  @Delete('deletar')
  async deletarLote(@Request() req: any, @Body() DeletarLoteDTO: DeletarLoteDTO): Promise<void> {
    try {
    await this.loteService.deletarLote(DeletarLoteDTO, req?.usuario?.sub);
    } catch (error) {
      throw error;
    }
  }
}
