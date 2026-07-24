import { BadRequestException, Body, Controller, Delete, Get, Logger, NotFoundException, Param, Post, Put, Query, Request, UseFilters, UseGuards } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import type { ListaDeProdutosInterface, Produto } from './produto.interface';
import type mongoose from 'mongoose';
import type { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import type { PaginacaoDTO } from '../Helper/paginacaodto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('produtos')
@UseFilters(new HttpExceptionFilter())
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @Post('/')
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
  async buscarTodosProdutos(@Query() query?: Record<string, string>, @Request() request?: any): Promise<ListaDeProdutosInterface> {
    try {
      const { limite, pule, pagina, ...filtro } = query ?? {};

      const paginacao: PaginacaoDTO = {
        limite: limite !== undefined ? Number(limite) : undefined,
        pagina: pagina !== undefined ? Number(pagina) - 1 : 0,
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