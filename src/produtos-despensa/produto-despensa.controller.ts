import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards,
} from '@nestjs/common';
import { ProdutoDespensaService } from './produto-despensa.service';
import type {
  CriarProdutoDespensaDTO,
  AtualizarProdutoDespensaDTO,
} from './produto-despensa.dto';
import type { ProdutoDespensa } from './produto-despensa.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('produtos-despensa')
export class ProdutoDespensaController {
  constructor(
    private readonly produtoDespensaService: ProdutoDespensaService,
  ) { }

  @Post()
  async criar(
    @Body() dados: CriarProdutoDespensaDTO,
  ): Promise<ProdutoDespensa> {
    return await this.produtoDespensaService.criar(dados);
  }

  @Get()
  async listar(): Promise<ProdutoDespensa[]> {
    return await this.produtoDespensaService.listar();
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProdutoDespensa> {
    const item = await this.produtoDespensaService.buscarPorId(id);
    if (!item) {
      throw new Error('Produto da despensa não encontrado');
    }
    return item;
  }

  @Get('despensa/:idDespensa')
  async buscarPorIdDespensa(
    @Param('idDespensa', ParseIntPipe) idDespensa: number,
  ): Promise<ProdutoDespensa[]> {
    const items = await this.produtoDespensaService.buscarPorIdDespensa(idDespensa);
    if (!items || items.length === 0) {
      throw new Error('Produtos da despensa não encontrados');
    }
    return items;
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarProdutoDespensaDTO,
  ): Promise<ProdutoDespensa> {
    return await this.produtoDespensaService.atualizar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.produtoDespensaService.remover(id);
  }
}
