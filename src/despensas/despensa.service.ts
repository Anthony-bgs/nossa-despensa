import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Despensa, DespensaCasa } from './despensa.interface';
import { CriarDespensaDTO, AtualizarDespensaDTO } from './despensa.dto';
import { supabase } from '../utils/supabase';
import { PadraoMensagem } from '../utils/padraomensagem';
import { CasaService } from '../casas/casa.service';

@Injectable()
export class DespensaService {
  constructor(
    @Inject(forwardRef(() => CasaService))
    private readonly casaservice: CasaService,
  ) { }

  async criar(dados: CriarDespensaDTO, idUsuario: number): Promise<Despensa> {
    if (!dados.nome || dados.nome.trim() === '' || !dados.casaId) {
      throw new BadRequestException(
        PadraoMensagem.ERRO_DADOS_INCOMPLETOS +
        ' ou ' +
        PadraoMensagem.ERRO_DADOS_INVALIDOS,
      );
    }
    await this.casaservice.validarCasa(dados.casaId, idUsuario);
    const { data, error } = await supabase
      .from('despensas')
      .insert({
        nome: dados.nome,
        casa_id: dados.casaId,
        tipo: dados.tipo,
        descricao: dados.descricao,
      })
      .select('*')
      .single();

    if (error) {
      throw new BadRequestException(PadraoMensagem.ERRO_INTERNO);
    }

    return this.mapDespensa(data);
  }
  async DespensaPorCasa(
    idCasa: number,
    usuarioId: number,
  ): Promise<DespensaCasa[]> {
    await this.casaservice.validarCasa(idCasa, usuarioId);
    const {data, error} = await supabase.from('despensas')
  .select('id, nome, locais_armazenamento(count), itens_despensa(count)')
  .eq('casa_id', idCasa)
  .order('nome', { ascending: true });    
  console.log(data)
  const resultado = data?.map((despensa: any) => ({
    nome: despensa.nome,
    quantidadeProdutos: despensa.itens_despensa[0].count,
    quantidadeLocaisArmazenamento: despensa.locais_armazenamento[0].count}))
  return resultado!;
}
  async buscarPorId(id: number): Promise<Despensa | null> {
    const { data, error } = await supabase
      .from('despensas')
      .select(
        `*,
        locais_armazenamento_despensa(id, local)
      `,
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return this.mapDespensaDetalhes(data);
  }

  async atualizar(id: number, dados: AtualizarDespensaDTO): Promise<Despensa> {
    const despensaExistente = await this.buscarPorId(id);
    if (!despensaExistente) {
      throw new NotFoundException('Despensa não encontrada');
    }

    const payload: AtualizarDespensaDTO = dados;

    const { data, error } = await supabase
      .from('despensas')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return this.mapDespensa(data);
  }

  async remover(id: number): Promise<void> {
    const despensa = await this.buscarPorId(id);
    if (!despensa) {
      throw new NotFoundException('Despensa não encontrada');
    }

    const { error } = await supabase.from('despensas').delete().eq('id', id);

    if (error) {
      throw error;
    }
  }

  private mapDespensa(despensa: any): Despensa {
    return {
      id: despensa.id,
      nome: despensa.nome,
      idUsuario: despensa.id_usuario,
      criadoEm: despensa.criado_em,
    };
  }

  private mapDespensaDetalhes(despensa: any): Despensa {
    return {
      id: despensa.id,
      nome: despensa.nome,
      idUsuario: despensa.id_usuario,
      criadoEm: despensa.criado_em,
      quantidadeProdutos: Number(
        Array.isArray(despensa.produtos_despensa)
          ? despensa.produtos_despensa.length
          : (despensa.produtos_despensa?.[0]?.count ?? 0),
      ),
      quantidadeLocaisArmazenamento: Number(
        Array.isArray(despensa.locais_armazenamento_despensa)
          ? despensa.locais_armazenamento_despensa.length
          : (despensa.locais_armazenamento_despensa?.[0]?.count ?? 0),
      ),
      locaisArmazenamentoDespensa: Array.isArray(
        despensa.locais_armazenamento_despensa,
      )
        ? despensa.locais_armazenamento_despensa.map((item: any) => ({
          id: item.id,
          local: item.local,
          idDespensa: item.id_despensa,
          criadoEm: item.criado_em,
        }))
        : [],
    };
}}
