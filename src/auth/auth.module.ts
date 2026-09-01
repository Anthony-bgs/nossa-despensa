import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuariosModule } from '../usuarios/usuario.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_EXPIRATION, JWT_SECRET } from '../Helper/constantes';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './oAuthStrategy';

@Module({
  imports: [
      PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: JWT_EXPIRATION },
    }),
    UsuariosModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy],
  exports: [AuthService],
})
export class AuthModule { }
