import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

export const getJwtStrategyConfig = (configService: ConfigService): JwtModuleOptions => ({
    secret: configService.get<string>('JWT_SECRET', 'your-secret-key'),
    signOptions: { expiresIn: '24h' },
});

export const getJwtStrategyOptions = (configService: ConfigService) => ({
    jwtFromRequest: (req: any) => {
        let token = null;
        if (req && req.headers) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith('Bearer ')) {
                token = authHeader.substring(7);
            }
        }
        return token;
    },
    ignoreExpiration: false,
    secretOrKey: configService.get<string>('JWT_SECRET', 'your-secret-key'),
});
