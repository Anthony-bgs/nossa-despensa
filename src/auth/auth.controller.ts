import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, InternalServerErrorException, Logger, Post, Req, Request, Res, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AuthGuard as oAuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest, Response } from 'express';
import { PadraoMensagem } from '../utils/padraomensagem';

@Controller('auth')
export class AuthController {
    private readonly logger = new Logger(AuthController.name);

    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @UseFilters(new HttpExceptionFilter())
    async signIn(@Body() signInDto: AuthDto, @Req() req: ExpressRequest, @Res({ passthrough: true }) res: Response): Promise<{ access_token: string }> {
        try {
            const result = await this.authService.signIn(signInDto.email, signInDto.senha);
            this.setAuthCookie(req, res, result.access_token);
            return result;
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(
            PadraoMensagem.ERRO_INTERNO,
            );
        }
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('/validate-token')
    validateToken(@Request() req: any): Promise<{ valid: boolean }> {
        try {
            return this.authService.validateTokenUser(req?.usuario?.sub);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            }
            throw new InternalServerErrorException(
                PadraoMensagem.ERRO_INTERNO,
            );
        }
    }

    @Get('google')
    @UseGuards(oAuthGuard('google'))
    async googleAuth(): Promise<void> {
        return;
    }

    @Get('google/callback')
    @UseGuards(oAuthGuard('google'))
    async googleAuthCallback(@Req() req: any, @Res() res: Response): Promise<void> {
        try {
            const user = req.user;

            if (!user?.email) {
                throw new UnauthorizedException('O Google nao retornou um e-mail valido.');
            }

            const result = await this.authService.signInGoogle({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                picture: user.picture,
            });

            this.setAuthCookie(req, res, result.access_token);
            res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
        } catch (error) {
            if (error instanceof HttpException) {
                throw error;
            }

            this.logger.error('Falha no callback de autenticacao do Google', error);
            throw new InternalServerErrorException(PadraoMensagem.ERRO_INTERNO);
        }
    }

    private setAuthCookie(req: ExpressRequest, res: Response, token: string): void {
        const forwardedProto = req.headers['x-forwarded-proto'];
        const protocol = Array.isArray(forwardedProto)
            ? forwardedProto[0]
            : forwardedProto?.split(',')[0]?.trim() ?? req.protocol;
        const isHttps = protocol === 'https';

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: isHttps,
            sameSite: isHttps ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
}
