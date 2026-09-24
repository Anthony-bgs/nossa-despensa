import { Body, Controller, Get, HttpCode, HttpStatus, InternalServerErrorException, Post, Req, Request, Res, UnauthorizedException, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AuthGuard as oAuthGuard } from '@nestjs/passport';
import type { Response } from 'express';
import { PadraoMensagem } from '../utils/padraomensagem';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('/login')
    @UseFilters(new HttpExceptionFilter())
    async signIn(@Body() signInDto: AuthDto, @Res({ passthrough: true }) res: Response): Promise<{ access_token: string }> {
        try {
            const result = await this.authService.signIn(signInDto.email, signInDto.senha);
            this.setAuthCookie(res, result.access_token);
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
        const user = req.user;

        const result = await this.authService.signInGoogle({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
        });

        this.setAuthCookie(res, result.access_token);
        res.redirect(process.env.FRONTEND_URL ?? 'http://localhost:3000');
    }

    private setAuthCookie(res: Response, token: string): void {
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });
    }
}
