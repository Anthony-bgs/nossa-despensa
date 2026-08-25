import {
  Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Request, UseFilters, UseGuards,
} from '@nestjs/common';
import { ProdutoDespensaService } from './produto-despensa.service';
import type {
  CriarProdutoDespensaDTO,
  AtualizarProdutoDespensaDTO,
} from './produto-despensa.dto';
import type { ProdutoDespensa } from './produto-despensa.interface';
import { AuthGuard } from '../auth/auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('produtos-despensa')
@UseFilters(new HttpExceptionFilter())

export class ProdutoDespensaController {
  constructor(
    private readonly produtoDespensaService: ProdutoDespensaService,
  ) { }

  @Post()
  async criar(
    @Request() req: any,
    @Body() dados: CriarProdutoDespensaDTO,
  ): Promise<ProdutoDespensa> {
    try {
    return await this.produtoDespensaService.criar(dados, req?.usuario?.sub);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async listar(): Promise<ProdutoDespensa[]> {
    try {
    return await this.produtoDespensaService.listar();
    } catch (error) {
      throw error;
    }
  }
  @Get ("confirmar-usuario/:id")
  async confirmarUsuario(@Param('id', ParseIntPipe) id: number, @Request() req: any): Promise<any> {
    try {
    return { usuarioId: req?.usuario?.sub };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  async buscarPorId(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProdutoDespensa> {
    try {
    const item = await this.produtoDespensaService.buscarPorId(id);
    if (!item) {
      throw new Error('Produto da despensa não encontrado');
    }
    return item;
    } catch (error) {
      throw error;
    }
  }

  @Get('despensa/:idDespensa')
  async buscarPorIdDespensa(
    @Param('idDespensa', ParseIntPipe) idDespensa: number,
  ): Promise<ProdutoDespensa[]> {
    try {
    const items = await this.produtoDespensaService.buscarPorIdDespensa(idDespensa);
    if (!items || items.length === 0) {
      throw new Error('Nenhum produto encontrado para a despensa especificada');
    }
    return items;
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarProdutoDespensaDTO,
  ): Promise<ProdutoDespensa> {
    try {
    return await this.produtoDespensaService.atualizar(id, dados);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remover(@Request() req: any, @Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
    await this.produtoDespensaService.remover(req?.usuario?.sub, id);
    } catch (error) {
      throw error;
    }
  }
}  
