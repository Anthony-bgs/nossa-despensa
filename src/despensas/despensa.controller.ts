import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DespensaService } from './despensa.service';
import type { CriarDespensaDTO, AtualizarDespensaDTO } from './despensa.dto';
import type { Despensa, DespensaCasa } from './despensa.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('despensas')
@UseFilters(new HttpExceptionFilter())
export class DespensaController {
  constructor(private readonly despensaService: DespensaService) {}

  @Post('')
  async criar(
    @Body() dados: CriarDespensaDTO,
    @Request() req: any,
  ): Promise<Despensa> {
    return await this.despensaService.criar(dados, req?.usuario?.sub);
  }
  @Get('/casa/:idcasa')
  async DespensaPorCasa(
    @Param('idcasa', ParseIntPipe) idCasa: number,
    @Request() req: any,
  ): Promise<DespensaCasa[]> {
    return await this.despensaService.DespensaPorCasa(idCasa, req?.usuario?.id);
  }
  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Despensa> {
    const despensa = await this.despensaService.buscarPorId(id);
    if (!despensa) {
      throw new Error('Despensa não encontrada');
    }
    return despensa;
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarDespensaDTO,
  ): Promise<Despensa> {
    try {
      return await this.despensaService.atualizar(id, dados);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.despensaService.remover(id);
    } catch (error) {
      throw error;
    }
  }
}
