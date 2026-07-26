import { Model } from 'mongoose';
import { Usuario } from './usuarios.interface';
export declare class UsuariosService {
    private usuarioModel;
    constructor(usuarioModel: Model<Usuario>);
    login(email: string, senha: string): Promise<Usuario | null>;
    criptografarSenha(senha: string): Promise<string>;
    compararSenhas(senhaTentativa: string, senhaUsuario: string): Promise<boolean>;
    existePorId(id: string): Promise<boolean>;
}
