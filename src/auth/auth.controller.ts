import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Request, Res, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { AuthGuard as oAuthGuard } from '@nestjs/passport';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    @UseFilters(new HttpExceptionFilter())
    signIn(@Body() signInDto: AuthDto): Promise<any> {
        try {
            return this.authService.signIn(signInDto.email, signInDto.senha);
        } catch (error) {
            throw error;
        }
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('validate-token')
    validateToken(@Request() req: any): Promise<{ valid: boolean }> {
        try {
            return this.authService.validateTokenUser(req?.usuario?.sub);
        } catch (error) {
            throw error;
        }
    }

    @Get('google')
    @UseGuards(oAuthGuard('google'))
    async googleAuth(@Req() req: any): Promise<void> {
        return;
    }

    @Get('google/callback')
    @UseGuards(oAuthGuard('google'))
    async googleAuthRedirect(@Req() req: any, @Res() res: Response): Promise<any> {
        const user = req.user;

        const result = await this.authService.signInGoogle({
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            picture: user.picture,
        });

        return res.status(HttpStatus.OK).json({
            access_token: result.access_token
        });
    }
}
