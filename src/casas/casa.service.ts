import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CasaCriarDTO} from "./casa.dto";
import { CasaSchema, CasaSchema_Criar } from "./casa.schema";
import { supabase } from "../utils/supabase";
import { Casa } from "./casa.interface";
import { MembroCasaService } from "../membros_casa/membro_casa.service";
import { Mensagens } from "../Helper/mensagens";

@Injectable()
export class CasaService {
    constructor(
        private readonly membroCasaService: MembroCasaService,
    ) { }

    async criar(dados: CasaCriarDTO, usuarioId: number): Promise<void> {
        const payload: CasaSchema_Criar = {
            nome: dados.nome,
            descricao: dados.descricao || undefined,
        };

        const { data, error } = await supabase.from('casas').insert(payload).select("id").single<CasaSchema>();

        if (error) {
            throw error;
        }

        await this.membroCasaService.criar({
            casaId: data.id!,
            usuarioId: usuarioId,
        });
    }

    async minhaCasa(usuarioId: number): Promise<any> {
        // IDENTIFICANDO A CASA DO USUÁRIO
        const identificandoCasa = await supabase.from('membros_casa')
            .select(`casa_id`)
            .eq('usuario_id', usuarioId)
            .single<{ casa_id: number }>();

        if (identificandoCasa.error || !identificandoCasa.data) {
            Logger.debug(identificandoCasa.error);
            throw new NotFoundException(Mensagens.CASA_NAO_ENCONTRADA);
        }

        const casa = await supabase.from('casas')
            .select(`id, nome, descricao, usuario_id`)
            .eq('id', identificandoCasa.data.casa_id)
            .single<CasaSchema>();

        if (casa.error || !casa.data) {
            Logger.debug(casa.error);
            throw new NotFoundException(Mensagens.CASA_NAO_ENCONTRADA);
        }

        // BUSCANDO OS DADOS DOS MEMBROS DA CASA
        const membros = await this.membroCasaService.buscarMembrosPorCasa(casa.data.id!);


        return {
            casa: this.mapCasaSchemaToCasa(casa.data),
            membros
        };
    }



    private mapCasaSchemaToCasa(casa: CasaSchema): Casa {
        return {
            id: casa.id || undefined,
            nome: casa.nome || undefined,
            descricao: casa.descricao || null || undefined,
            criadoPor: casa.usuario_id || undefined,
            criadoEm: casa.criado_em ? new Date(casa.criado_em).toLocaleString() : undefined,
            atualizadoEm: casa.atualizado_em ? new Date(casa.atualizado_em).toLocaleString() : null,
        };
    }
    
}
