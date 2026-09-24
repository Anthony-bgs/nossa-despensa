import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from '../usuarios/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { PadraoMensagem } from '../utils/padraomensagem';

@Injectable()
export class AuthService {
    constructor(
        private readonly usuarioService: UsuariosService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, senha: string): Promise<{ access_token: string, date: Date }> {
        const usuario = await this.usuarioService.login(email, senha);
        const date = new Date();
        if (!usuario) {
            throw new UnauthorizedException(PadraoMensagem.ERRO_VALIDACAO);
        }

        const payload = { id: usuario.id, email: usuario.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
            date: date,
        };
    }

    async signInGoogle(profile: {
        email: string;
        firstName?: string;
        lastName?: string;
        picture?: string;
    }): Promise<{ access_token: string; usuario: number; email: string }> {
        const nome = [profile.firstName, profile.lastName]
            .filter(Boolean)
            .join(' ')
            .trim() || profile.email.split('@')[0];

        const usuario = await this.usuarioService.criarOuBuscarPorGoogle({
            email: profile.email,
            nome,
            foto: profile.picture,
        });

        const payload = { id: usuario.id, email: usuario.email };

        return {
            access_token: await this.jwtService.signAsync(payload),
            usuario: usuario.id,
            email: usuario.email,
        };
    }

    async validateTokenUser(userId: number ): Promise<{ valid: boolean }> {
        if (!userId) {
            throw new UnauthorizedException(PadraoMensagem.ERRO_ACESSO_NEGADO);
        }

        const usuarioValido = await this.usuarioService.existePorId(userId);
        if (!usuarioValido) {
            throw new UnauthorizedException(PadraoMensagem.ERRO_ACESSO_NEGADO);
        }

        return { valid: true };
    }
}