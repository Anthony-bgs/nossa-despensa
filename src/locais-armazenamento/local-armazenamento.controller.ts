import {Body,Controller,Delete,Get,Param,ParseIntPipe,Post,Put,UseFilters,UseGuards,} 
from '@nestjs/common';
import { LocalArmazenamentoService } from './local-armazenamento.service';
import type {
  CriarLocalArmazenamentoDTO,
  AtualizarLocalArmazenamentoDTO,
} from './local-armazenamento.dto';
import type { LocalArmazenamento } from './local-armazenamento.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('locais-armazenamento')
@UseFilters(new HttpExceptionFilter())
export class LocalArmazenamentoController {
  constructor(
    private readonly localArmazenamentoService: LocalArmazenamentoService,
  ) {}

  @Post()
  async criar(@Body() dados: CriarLocalArmazenamentoDTO): Promise<LocalArmazenamento> {
    try {
    return await this.localArmazenamentoService.criar(dados);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async listar(): Promise<LocalArmazenamento[]> {
    try {
    return await this.localArmazenamentoService.listar();
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<LocalArmazenamento> {
    const local = await this.localArmazenamentoService.buscarPorId(id);
    if (!local) {
      throw new Error('Local de armazenamento não encontrado');
    }
    return local;
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarLocalArmazenamentoDTO,
  ): Promise<LocalArmazenamento> {
    try {
    return await this.localArmazenamentoService.atualizar(id, dados);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
    await this.localArmazenamentoService.remover(id);
    } catch (error) {
      throw error;
    }
  }
}
