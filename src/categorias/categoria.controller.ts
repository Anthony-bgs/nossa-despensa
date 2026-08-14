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
import { CategoriaService } from './categoria.service';
import type { CriarCategoriaDTO, AtualizarCategoriaDTO } from './categoria.dto';
import type { Categoria } from './categoria.interface';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('categorias')
export class CategoriaController {
  constructor(private readonly categoriaService: CategoriaService) {}

  @Post()
  async criar(@Body() dados: CriarCategoriaDTO): Promise<Categoria> {
    return await this.categoriaService.criar(dados);
  }

  @Get()
  async listar(): Promise<Categoria[]> {
    return await this.categoriaService.listar();
  }

  @Get(':id')
  async buscarPorId(@Param('id', ParseIntPipe) id: number): Promise<Categoria> {
    const categoria = await this.categoriaService.buscarPorId(id);
    if (!categoria) {
      throw new Error('Categoria não encontrada');
    }
    return categoria;
  }

  @Put(':id')
  async atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dados: AtualizarCategoriaDTO,
  ): Promise<Categoria> {
    return await this.categoriaService.atualizar(id, dados);
  }

  @Delete(':id')
  async remover(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.categoriaService.remover(id);
  }
}
