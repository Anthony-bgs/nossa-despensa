import { Body, Controller, Get, HttpCode, Param, Post, Req, Request, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { CasaService } from "./casa.service";
import { AuthGuard } from "../auth/auth.guard";
import type { CasaCriarDTO, EntrarComConviteDTO } from "./casa.dto";

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
    @Post("/entrar-convite")
    @UseGuards(AuthGuard)
    async entrarComConvite(@Body() dados: EntrarComConviteDTO, @Req() req: any): Promise<void> {
        try {
            await this.casaService.entrarComConvite(dados.codigo, req.usuario.id);
        } catch (error) {
            throw error;
        }
    }
}