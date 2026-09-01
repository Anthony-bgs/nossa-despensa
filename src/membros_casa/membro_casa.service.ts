import { Injectable } from "@nestjs/common";
import { adicionarMembroDTO, MembroCasaDTO_Criar } from "./membro_casa.dto";
import { MembroCasaSchema, MembroCasaSchema_Criar } from "./membro_casa.schema";
import { supabase } from "../utils/supabase";

@Injectable()
export class MembroCasaService {
    constructor() { }

    async criar(dados: MembroCasaDTO_Criar): Promise<void> {
        const payload: MembroCasaSchema_Criar = {
            casa_id: dados.casaId,
            usuario_id: dados.usuarioId,
        };

        const { data, error } = await supabase.from('membros_casa').insert(payload).select("id").single<MembroCasaSchema>();

        if(error) {
            throw error;
        }
    }

    async buscarMembrosPorCasa(casaId: number): Promise<any> {
        const { data, error } = await supabase.from('membros_casa')
            .select(`usuario:usuarios(id, nome, email, foto), papel, status`)
            .eq('casa_id', casaId);
        if (error) {
            throw error;
        }

        const response = data.map((membro: any) => ({
            usuario: {
                id: membro.usuario.id,
                nome: membro.usuario.nome,
                email: membro.usuario.email,
                foto: membro.usuario.foto || null,
                papel: membro.papel,
                status: membro.status,
            },
        }));
        return response;
    }
    async adicionarMembro(dados: adicionarMembroDTO, id: number): Promise<void> {
        const payload: MembroCasaSchema_Criar = {
            
            casa_id: dados.casaId,
            usuario_id: dados.usuarioId,
            codigo: dados.codigo,
        };
        
        const { data, error } = await supabase.from('membros_casa').insert(payload).select("id").single<MembroCasaSchema>();

        if(error) {
            throw error;
        }
    }
    async convidarMembro(casaId: number, usuarioId: number): Promise<void> {
        const codigo = Math.floor(100000 + Math.random() * 900000).toString().substring(0, 6);
        const payload = {
            casa_id: casaId,
            usuario_id:usuarioId,
            codigo: codigo,
        };

        const { data, error } = await supabase.from('codigo_convite').insert(payload).single();
        if (error) {
            throw error;
        }
        return;
    }
}