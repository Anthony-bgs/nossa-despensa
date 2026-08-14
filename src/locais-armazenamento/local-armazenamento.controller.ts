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
import { LocalArmazenamentoService } from './local-armazenamento.service';
import type {
  CriarLocalArmazenamentoDTO,
  AtualizarLocalArmazenamentoDTO,
} from './local-armazenamento.dto';
import type { LocalArmazenamento } from './local-armazenamento.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('locais-armazenamento')
export class LocalArmazenamentoController {
  constructor(
    private readonly localArmazenamentoService: LocalArmazenamentoService,
  ) {}

  @Post()
  async criar(@Body() dados: CriarLocalArmazenamentoDTO): Promise<LocalArmazenamento> {
    return await this.localArmazenamentoService.criar(dados);
  }

  @Get()
  async listar(): Promise<LocalArmazenamento[]> {
    return await this.localArmazenamentoService.listar();
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
    return await this.localArmazenamentoService.atualizar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.localArmazenamentoService.remover(id);
  }
}
