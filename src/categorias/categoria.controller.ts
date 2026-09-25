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
import { CategoriaService } from './categoria.service';
import type { CriarCategoriaDTO, AtualizarCategoriaDTO, BuscarCategoriaDTO } from './categoria.dto';
import type { Categoria } from './categoria.interface';
import { AuthGuard } from '../auth/auth.guard';
import { PadraoMensagem } from '../utils/padraomensagem';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@UseGuards(AuthGuard)
@Controller('categorias')
@UseFilters(new HttpExceptionFilter())
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) { }

  @Post()
  async criar(@Body() dados: CriarCategoriaDTO): Promise<Categoria> {
    try {
    return await this.categoriaService.criar(dados);
    } catch (error) {
      throw error;
    }
  }

  @Get()
  async listar(@Body() dados: BuscarCategoriaDTO): Promise<Categoria[]> {
    try { 
    return await this.categoriaService.listar(dados);
    } catch (error) {
      throw error;
  }
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Categoria | null> {
    try {
      const categoria = await this.categoriaService.buscarPorId(id);
      return categoria;

    } catch (error: any) {
      Logger.error('Erro ao criar produto:', error);
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarCategoriaDTO,
  ): Promise<string> {
    try {
       return await this.categoriaService.atualizar(id, dados);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.categoriaService.remover(id);
    }
    catch (error: any) {
      Logger.error('Erro ao criar produto:', error);
      throw new BadRequestException(error.message);
    }
  }
}
