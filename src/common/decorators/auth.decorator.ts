import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from './roles.decorator';

export function AuthRequired() {
    return applyDecorators(
        UseGuards(AuthGuard),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Authentication required' }),
    );
}

export function AdminAuthRequired() {
    return applyDecorators(
        UseGuards(AuthGuard),
        Roles('admin', 'super_admin'),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Admin access required' }),
    );
}

export function GuestRequired() {
    return applyDecorators(
        UseGuards(AuthGuard),
        Roles('guest'),
        ApiBearerAuth(),
        ApiUnauthorizedResponse({ description: 'Guest access required' }),
    );
}
