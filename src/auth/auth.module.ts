import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../modules/user/user.module';
import { AdminModule } from '../modules/admin/admin.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthFactory } from './factories/auth-factory';
import { LocalStrategy } from './strategies/auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AdminJwtStrategy } from './strategies/admin-jwt.strategy';
import { jwtConfig } from '../config/jwt.config';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync(jwtConfig),
    UserModule,
    AdminModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthFactory,
    LocalStrategy,
    JwtStrategy,
    AdminJwtStrategy,
  ],
  exports: [AuthService, AuthFactory],
})
export class AuthModule { }