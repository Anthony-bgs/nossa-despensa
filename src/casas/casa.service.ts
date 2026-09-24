import { ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CasaCriarDTO, criacaocompletaDTO } from "./casa.dto";
import { CasaSchema, CasaSchema_Criar, } from "./casa.schema";
import { supabase } from "../utils/supabase";
import { Casa } from "./casa.interface";
import { MembroCasaService } from "../membros_casa/membro_casa.service";
import { Mensagens } from "../Helper/mensagens";
import { PapelMembroCasa, StatusMembroCasa } from "../Helper/enum";
import { ProdutoService } from "../produtos/produto.service";
import { LocalArmazenamentoService } from "../locais-armazenamento/local-armazenamento.service";
import { ProdutoDespensaService } from "../produtos-despensa/produto-despensa.service";
import { DespensaService } from "../despensas/despensa.service";

@Injectable()
export class CasaService {
    constructor(
        @Inject(forwardRef(() => MembroCasaService))
        private readonly membroCasaService: MembroCasaService,
        @Inject(forwardRef(() => ProdutoService))
        private readonly produtoService: ProdutoService,
        @Inject(forwardRef(() => DespensaService))
        private readonly despensaService: DespensaService,
        @Inject(forwardRef(() => LocalArmazenamentoService))
        private readonly localArmazenamentoService: LocalArmazenamentoService,
        @Inject(forwardRef(() => ProdutoDespensaService))
        private readonly produtoDespensaService: ProdutoDespensaService
    ) { }

    async criar(dados: CasaCriarDTO, usuarioId: number): Promise<number> {
        const payload: CasaSchema_Criar = {
            nome: dados.nome,
            usuario_id: usuarioId,
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
        return data.id!;
      
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
    async entrarComConvite(codigoconvite: string, usuarioId: number): Promise<void> {
        try {
            const { data, error } = await supabase.from("codigo_convite").select("casa_id").eq("codigo", codigoconvite).single();

            if (error && !data) {
                throw new NotFoundException("convite não encontrado");
            }

            await this.membroCasaService.criar({
                casaId: data.casa_id,
                usuarioId: usuarioId,
                papel: PapelMembroCasa.MEMBRO,
                status: StatusMembroCasa.ACEITO,
            });
        } catch (error) {
            throw error;
        }
    }
    async validarCasa(casaId: number, usuarioId: number): Promise<boolean> {
        const { data, error } = await supabase.from('membros_casa')
            .select('casa_id')
            .eq('casa_id', casaId)
            .eq('usuario_id', usuarioId)
            .single();
        if (!data) {
            throw new NotFoundException(Mensagens.CASA_NAO_ENCONTRADA);
        }
        return true;
    }
    async conferiremailconvite(emailDestinatario: string, casaId: number): Promise<boolean> {
        const { data, error } = await supabase.from('usuarios').select('id,membros_casa!inner(usuario_id)').eq('email', emailDestinatario).single();
        if (data) {
            throw new ConflictException(Mensagens.USUARIO_JA_EXISTE_NA_CASA);
        }
        return true;
    }
    async criacaocompleta(dados: criacaocompletaDTO, usuarioId: number): Promise<void> {
        try {
            const casa = await this.criar({ nome: dados.casa }, usuarioId);
           const despensa = await this.despensaService.criar({nome: dados.despensa, casaId: casa  },usuarioId);
            const depensaid = despensa.id;
            const localArmazenamento = await this.localArmazenamentoService.criar({
                local: dados.prateleira,
                idDespensa: depensaid,});
            for (const produto of dados.produtos) {
                const produtoId = await this.produtoDespensaService.criar({
                    idDespensa: depensaid,
                    idProduto: produto.id,
                    idCategoria: produto.itemDespensa.categoria,
                    idLocal: localArmazenamento.id,
                    quantidade: produto.itemDespensa.quantidade,
                    validade: produto.itemDespensa.validade,
                    casaId: casa,
                }, casa);
            }
            
            ;
        } catch (error) {
            throw error;
        }


       
    
        return
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

