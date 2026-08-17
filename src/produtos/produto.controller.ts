import { BadRequestException, Body, Controller, Delete, Get, HttpCode, Logger, NotFoundException, Param, Post, Put, Query, Request, UseFilters, UseGuards } from '@nestjs/common';
import { ProdutoService } from './produto.service';
import type { ListaDeProdutosInterface, Produto } from './produto.interface';
import type { AtualizarProdutoDTO, FiltroDTO, NovoProdutoDTO } from './produto.dto';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import type { PaginacaoDTO } from '../Helper/paginacaodto';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('produtos')
@UseFilters(new HttpExceptionFilter())
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) { }

  @HttpCode(201)
  @Post('/')
  async novoProduto(@Body() dados: NovoProdutoDTO): Promise<string> {
    try {
      return await this.produtoService.novoProduto(dados);
    } catch (error: any) {
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
    } catch (error: any) {
      Logger.error('Erro ao buscar produtos:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Get('/:id')
  async buscarProdutoPorId(@Param('id') id: number): Promise<Produto | string> {
    const produto = await this.produtoService.buscarProdutoPorId(id);
    if (!produto) {
      throw new NotFoundException('Produto nao encontrado');
    }
    return produto;
  }

  @Put('/:id')
  async atualizarProduto(@Body() dados: AtualizarProdutoDTO, @Param('id') id: number): Promise<void> {
    try {
      await this.produtoService.atualizarProduto(id, dados);
    } catch (error: any) {
      Logger.error('Erro ao atualizar produto:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Delete('/:id')
  async deletarProduto(@Param('id') id: number): Promise<void> {
    try {
      const produtoDeletado = await this.produtoService.deletarProduto(id);
      if (!produtoDeletado) {
        throw new NotFoundException('Produto nao encontrado');
      }

    } catch (error: any) {
      Logger.error('Erro ao deletar produto:', error);
      throw new BadRequestException(error.message);
    }
  }
}