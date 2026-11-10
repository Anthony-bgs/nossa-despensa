import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { CasaCriarDTO, CriacaoCompletaDTO } from "./casa.dto";
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
import { PadraoMensagem } from "../utils/padraomensagem";


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
        if (!dados.nome || dados.nome.trim() === '') {
            throw new BadRequestException(PadraoMensagem.ERRO_DADOS_INCOMPLETOS + " ou " + PadraoMensagem.ERRO_DADOS_INVALIDOS);
        }
        const payload: CasaSchema_Criar = {
            nome: dados.nome,
            usuario_id: usuarioId,
            descricao: dados.descricao || undefined,
        };

        const { data, error } = await supabase.from('casas').insert(payload).select("id").single<CasaSchema>();
        if (error) {
            throw new BadRequestException(PadraoMensagem.ERRO_AO_CADASTRAR);
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

        if (identificandoCasa.error) {
            throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
        }
        if (!identificandoCasa.data) {
           throw new NotFoundException(PadraoMensagem.ERRO_NAO_ENCONTRADO);
        }

        const {data:casa, error} = await supabase.from('casas')
            .select(`id, nome, descricao, usuario_id`)
            .eq('id', identificandoCasa.data.casa_id)
            .single<CasaSchema>();

        if (!casa) {
            throw new NotFoundException(PadraoMensagem.ERRO_NAO_ENCONTRADO);
        }
        if (error) {
            throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
        }

        // BUSCANDO OS DADOS DOS MEMBROS DA CASA
        const membros = await this.membroCasaService.buscarMembrosPorCasa(casa.id!);


        return {
            casa: this.mapCasaSchemaToCasa(casa),
            membros
        };
    }
    async entrarComConvite(codigoconvite: string, usuarioId: number): Promise<void> {
        try {
            const { data, error } = await supabase.from("codigo_convite").select("casa_id").eq("codigo", codigoconvite).single();

            if (!data) {
                throw new NotFoundException("convite não encontrado");
            }
            if (error) {
                throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
            }

            await this.membroCasaService.criar({
                casaId: data.casa_id,
                usuarioId: usuarioId,
                papel: PapelMembroCasa.MEMBRO,
                status: StatusMembroCasa.ACEITO,
            });
        } catch (error) {
            throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
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
        if (error) {
            throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
        }
        return true;
    }
    async conferiremailconvite(emailDestinatario: string, casaId: number): Promise<boolean> {
        const { data, error } = await supabase
            .from('usuarios')
            .select('id, membros_casa!inner(casa_id)')
            .eq('email', emailDestinatario.trim())
            .eq('membros_casa.casa_id', casaId)
            .limit(1);

        if (error) {
            throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
        }
        if (data.length > 0) {
            throw new ConflictException(Mensagens.USUARIO_JA_EXISTE_NA_CASA);
        }

        return true;
    }
    async criacaocompleta(dados: CriacaoCompletaDTO, usuarioId: number): Promise<void> {
        if (!dados) {
            throw new BadRequestException(Mensagens.DADOS_INVALIDOS);
        }
        try {
            const casa = await this.criar({ nome: dados.casa }, usuarioId);
            for (const item of dados.itens) {
                const despensa = await this.despensaService.criar({ nome: item.despensa, casaId: casa }, usuarioId);
                const localArmazenamento = await this.localArmazenamentoService.criar({
                    local: item.prateleira,
                    idDespensa: despensa.id,
                });
                for (const produto of item.produtos) {
                    const produtoId = await this.produtoDespensaService.criar({
                        idDespensa: despensa.id,
                        idProduto: produto.id,
                        idCategoria: produto.itemDespensa.categoria,
                        idLocal: localArmazenamento.id,
                        quantidade: produto.itemDespensa.quantidade,
                        validade: produto.itemDespensa.validade,
                        casaId: casa,
                    }, casa);
                }
            }
        } catch (error) {
            throw error;
        }
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

