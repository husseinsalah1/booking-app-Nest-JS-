import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { getJwtStrategyOptions } from '../../config/jwt-strategy.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService,
    ) {
        super(getJwtStrategyOptions(configService));
    }

    async validate(payload: any) {
        const user = await this.authService.validate(payload);
        if (!user) {
            throw new UnauthorizedException();
        }
        return { ...user, role: user.role || 'guest' };
    }
}
