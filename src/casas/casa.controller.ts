import { Body, Controller, Get, HttpCode, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { CasaService } from "./casa.service";
import type { CasaCriarDTO } from "./casa.dto";
import { AuthGuard } from "../auth/auth.guard";

@Controller('casa')
@UseFilters(new HttpExceptionFilter())
export class CasaController {
    constructor(private readonly casaService: CasaService) { }

    @HttpCode(201)
    @Post("/")
    @UseGuards(AuthGuard)
    async criar(@Body() dados: CasaCriarDTO, @Req() req: any): Promise<void> {
        try {
            await this.casaService.criar(dados, req.usuario.id);
        } catch (error) {
            throw error;
        }
    }

    @Get("/minha-casa")
    @UseGuards(AuthGuard)
    async minhaCasa(@Req() req: any): Promise<any> {
        try {
            return await this.casaService.minhaCasa(req.usuario.id);
        } catch (error) {
            throw error;
        }
    }
}