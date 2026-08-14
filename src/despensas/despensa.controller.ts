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
import { DespensaService } from './despensa.service';
import type { CriarDespensaDTO, AtualizarDespensaDTO } from './despensa.dto';
import type { Despensa } from './despensa.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('despensas')
export class DespensaController {
  constructor(private readonly despensaService: DespensaService) {}

  @Post()
  async criar(@Body() dados: CriarDespensaDTO): Promise<Despensa> {
    return await this.despensaService.criar(dados);
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
