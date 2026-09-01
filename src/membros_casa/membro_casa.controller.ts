import { Body, Controller, HttpCode, Param, Post, Req, UseFilters, UseGuards } from "@nestjs/common";
import { HttpExceptionFilter } from "../filters/http-exception.filter";
import { AuthGuard } from "../auth/auth.guard";
import { MembroCasaService } from "./membro_casa.service";
import type { adicionarMembroDTO } from "./membro_casa.dto";
import type { EmailDTO } from "../casas/casa.dto";
import { EmailService } from "../mensagem/email.service";

@Controller('membros-casa')
@UseFilters(new HttpExceptionFilter())
export class MembroCasaController {
    constructor(private readonly membroCasaService: MembroCasaService,private readonly emailService: EmailService) { }


@HttpCode(201)
@Post ("/adicionar-membro")
@UseGuards(AuthGuard)
async adicionarMembro(@Body() dados: adicionarMembroDTO, @Req() req: any): Promise<void> {
    await this.membroCasaService.adicionarMembro(dados, req.user.id);
}
   @Post("/convidar-membro")
    @UseGuards(AuthGuard)
    async convidarMembro(@Param("casa_id") casaId: number, @Req() req: any): Promise<void> {
        try {
            await this.membroCasaService.convidarMembro(casaId , req.usuario.id);
        } catch (error) {
            throw error;
        }
    }
     @Post("/enviar")
    async enviarEmail(@Body() dados: EmailDTO): Promise<void> {
        try {
            // Enviar o e-mail usando o serviço de e-mail
            await this.emailService.enviarEmail(dados);
            console.log("E-mail enviado com sucesso!");
        } catch (error) {
            console.error("Erro ao enviar o e-mail:", error);
            throw error;
        }
}
}
