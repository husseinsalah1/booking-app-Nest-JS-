import { Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/user.service';
import { AdminService } from '../../modules/admin/admin.service';
import { User } from '../../common/entities/user.entity';
import { Admin } from '../../common/entities/admin.entity';

export interface AuthResult {
    entity: User | Admin;
    type: 'user' | 'admin';
}

@Injectable()
export class AuthFactory {
    constructor(
        private readonly userService: UserService,
        private readonly adminService: AdminService,
    ) { }

    async createAuthResult(email: string, password: string): Promise<AuthResult | null> {
        const userResult = await this.authenticateUser(email, password);
        if (userResult) {
            return userResult;
        }

        const adminResult = await this.authenticateAdmin(email, password);
        if (adminResult) {
            return adminResult;
        }

        return null;
    }

    private async authenticateUser(email: string, password: string): Promise<AuthResult | null> {
        try {
            const user = await this.userService.findByEmail(email);
            if (!user) return null;

            const isPasswordValid = await this.userService.validatePassword(user, password);
            if (!isPasswordValid) return null;

            return {
                entity: user,
                type: 'user',
            };
        } catch (error) {
            return null;
        }
    }

    private async authenticateAdmin(email: string, password: string): Promise<AuthResult | null> {
        try {
            const admin = await this.adminService.findByEmail(email);
            if (!admin) return null;

            const isPasswordValid = await this.adminService.validatePassword(admin, password);
            if (!isPasswordValid) return null;

            return {
                entity: admin,
                type: 'admin',
            };
        } catch (error) {
            return null;
        }
    }

    async createJwtPayload(entity: User | Admin, type: 'user' | 'admin'): Promise<any> {
        const basePayload = {
            sub: entity.id,
            email: entity.email,
            type,
        };

        if (type === 'admin') {
            return {
                ...basePayload,
                role: (entity as Admin).role,
            };
        } else {
            return {
                ...basePayload,
                role: (entity as User).role || 'user',
            };
        }
    }

    formatAuthResponse(entity: User | Admin, type: 'user' | 'admin'): any {
        if (type === 'admin') {
            const admin = entity as Admin;
            return {
                admin: {
                    id: admin.id,
                    email: admin.email,
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    role: admin.role,
                },
            };
        }

        const user = entity as User;
        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                credits: user.credits,
            },
        };
    }
}