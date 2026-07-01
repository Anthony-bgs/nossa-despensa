import { BadRequestException, Body, Controller, Get, HttpStatus, Logger, Post, Query, Res, UseFilters } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import type { Produto } from './produto.interface';
import type { Response } from 'express';
import type mongoose from 'mongoose';
import type { NovoProdutoDTO } from './produto.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

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
  async buscarTodosProdutos(@Query() filtro?: Partial<Produto>): Promise<Produto[]> {
    try {
      return this.produtoService.buscarTodosProdutos(filtro);
    } catch (error: mongoose.Error | any) {
      Logger.error('Erro ao buscar produtos:', error);
      throw new BadRequestException(error.message);
    }
  }
}
