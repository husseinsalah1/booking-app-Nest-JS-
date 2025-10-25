import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from './roles.decorator';

export function AdminRequired() {
    return applyDecorators(
        Roles('admin', 'super_admin'),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Admin access required' }),
    );
}

export function SuperAdminRequired() {
    return applyDecorators(
        Roles('super_admin'),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Super admin access required' }),
    );
}
