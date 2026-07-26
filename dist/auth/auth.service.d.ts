import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usuarioService;
    private jwtService;
    constructor(usuarioService: UsuariosService, jwtService: JwtService);
    signIn(email: string, senha: string): Promise<{
        access_token: string;
    }>;
    validateTokenUser(userId: string | undefined): Promise<{
        valid: boolean;
    }>;
}
