import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: AuthDto): Promise<any> {
        return this.authService.signIn(signInDto.email, signInDto.senha);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.OK)
    @Get('validate-token')
    validateToken(@Request() req: any): Promise<{ valid: boolean }> {
        return this.authService.validateTokenUser(req?.usuario?.sub);
    }
}
