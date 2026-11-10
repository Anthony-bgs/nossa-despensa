import { Body, Controller, HttpCode, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { AuthGuard } from "../auth/auth.guard";
import { MembroCasaService } from "./membro_casa.service";
import type { adicionarMembroDTO, convidarMembroDTO } from "./membro_casa.dto";

@Controller('membros-casa')
@UseFilters(new HttpExceptionFilter())
export class MembroCasaController {
    constructor(private readonly membroCasaService: MembroCasaService) { }


@HttpCode(201)
@Post ("/adicionar-membro")
@UseGuards(AuthGuard)
async adicionarMembro(@Body() dados: adicionarMembroDTO, @Req() req: any): Promise<void> {
    await this.membroCasaService.adicionarMembro(dados, req.usuario.id);
}
   @Post("/convidar-membro")
    @UseGuards(AuthGuard)
    async convidarMembro(@Body() dados: convidarMembroDTO, @Req() req: any): Promise<void> {
        try {
            await this.membroCasaService.convidarMembro(dados, req.usuario.id);
        } catch (error) {
            throw error;
        }
    }
 }
