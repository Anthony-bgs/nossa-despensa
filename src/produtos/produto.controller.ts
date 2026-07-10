import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Logger, NotFoundException, Param, Post, Put, Query, Res, UseFilters } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import type { Produto } from './produto.interface';
import type { Response } from 'express';
import type mongoose from 'mongoose';
import type { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import type { PaginacaoDTO } from '../Helper/paginacaodto';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Post('/')
  @UseFilters(new HttpExceptionFilter())
  async novoProduto(@Body() dados: NovoProdutoDTO): Promise<Produto | void> {
    try {
      const produto = await this.produtoService.novoProduto(dados);
      return produto;
    } catch (error: mongoose.Error | any) {
      Logger.error('Erro ao criar produto:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/')
  async buscarTodosProdutos(@Query() query?: Record<string, string>): Promise<Produto[]> {
    try {
      const { limite, pule, ...filtro } = query ?? {};

      const paginacao: PaginacaoDTO = {
        limite: limite !== undefined ? Number(limite) : undefined,
        pule: pule !== undefined ? Number(pule) : undefined,
      };

      return this.produtoService.buscarTodosProdutos(filtro as Partial<FiltroDTO>, paginacao);
    } catch (error: mongoose.Error | any) {
      Logger.error('Erro ao buscar produtos:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:id')
  async buscarProdutoPorId(@Param('id') id: string): Promise<Produto | string> {
    const produto = await this.produtoService.buscarProdutoPorId(id);
    if (!produto) {
      throw new NotFoundException('Produto nao encontrado');
    }
    return produto;
  }

  @Put('/:id')
  async atualizarProduto(@Body() dados: AtualizarProdutoDTO, @Param('id') id: string): Promise<Produto | null> {
    try {
      const produtoAtualizado = await this.produtoService.atualizarProduto(id, dados);
      return produtoAtualizado;
    } catch (error: mongoose.Error | any) {
      Logger.error('Erro ao atualizar produto:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/:id')
  async deletarProduto(@Param('id') id: string): Promise<Produto | string> {
    try {
      const produtoDeletado = await this.produtoService.deletarProduto(id);
      if (!produtoDeletado) {
        throw new NotFoundException('Produto nao encontrado');
      }
      return "Produto deletado com sucesso";
    } catch (error: mongoose.Error | any) {
      Logger.error('Erro ao deletar produto:', error);
      throw new BadRequestException(error.message);
    }
  }
}