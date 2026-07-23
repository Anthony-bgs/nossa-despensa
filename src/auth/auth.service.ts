import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuariosService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, senha: string): Promise<{ access_token: string }> {
        const usuario = await this.usuarioService.login(email, senha);
        if (!usuario) {
            throw new UnauthorizedException();
        }

        const payload = { sub: usuario._id, email: usuario.email };
        // TODO: Generate a JWT and return it here
        // instead of the user object
        return {
            // 💡 Here the JWT secret key that's used for signing the payload 
            // is the key that was passed in the JwtModule
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async validateTokenUser(userId: string | undefined): Promise<{ valid: boolean }> {
        if (!userId) {
            throw new UnauthorizedException();
        }

        const usuarioValido = await this.usuarioService.existePorId(userId);
        if (!usuarioValido) {
            throw new UnauthorizedException();
        }

        return { valid: true };
    }
}
