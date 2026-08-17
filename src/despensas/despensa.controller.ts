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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DespensaService } from './despensa.service';
import type { CriarDespensaDTO, AtualizarDespensaDTO } from './despensa.dto';
import type { Despensa } from './despensa.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('despensas')
@UseFilters(new HttpExceptionFilter())
export class DespensaController {
  constructor(private readonly despensaService: DespensaService) { }

  @Post("usuario/:idUsuario")
  async criar(@Body() dados: CriarDespensaDTO, @Param('idUsuario', ParseIntPipe) idUsuario: number): Promise<Despensa> {
    try {
      return await this.despensaService.criar(dados, idUsuario);
    } catch (error: any) {
      Logger.error('Erro ao criar despensa:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('usuario/:idUsuario')
  async listarPorUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number): Promise<Despensa[]> {
    return await this.despensaService.listarPorUsuario(idUsuario);
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
    return await this.despensaService.atualizar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.despensaService.remover(id);
  }
}
