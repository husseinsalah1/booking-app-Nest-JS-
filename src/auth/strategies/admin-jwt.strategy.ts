import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AdminService } from '../../modules/admin/admin.service';
import { getJwtStrategyOptions } from '../../config/jwt-strategy.config';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
    constructor(
        private readonly configService: ConfigService,
        private readonly adminService: AdminService,
    ) {
        super(getJwtStrategyOptions(configService));
    }

    async validate(payload: any) {
        if (payload.type !== 'admin') {
            throw new UnauthorizedException('Invalid token type');
        }

        const admin = await this.adminService.validateAdmin(payload.sub);
        if (!admin) {
            throw new UnauthorizedException('Admin not found or inactive');
        }
        return admin;
    }
}
