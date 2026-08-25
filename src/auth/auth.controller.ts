import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseFilters, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

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
             return this.authService.validateTokenUser(req?.usuario?.sub)
        } catch (error) {
            throw error;
        }
    }
}
