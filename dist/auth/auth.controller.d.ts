import { AuthService } from './auth.service';
import type { AuthDto } from './auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signIn(signInDto: AuthDto): Promise<any>;
    validateToken(req: any): Promise<{
        valid: boolean;
    }>;
}
