import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true;
        }

        return super.canActivate(context);
    }

    handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
        if (err || !user) {
            // Handle specific JWT errors with better messages
            if (info && info.name === 'TokenExpiredError') {
                throw new UnauthorizedException('Token has expired');
            } else if (info && info.name === 'JsonWebTokenError') {
                throw new UnauthorizedException('Invalid token');
            } else if (info && info.name === 'NotBeforeError') {
                throw new UnauthorizedException('Token not active');
            } else if (err && err.message) {
                // Handle passport-jwt error messages
                if (err.message.includes('jwt expired')) {
                    throw new UnauthorizedException('Token has expired');
                } else if (err.message.includes('jwt malformed') || err.message.includes('invalid token')) {
                    throw new UnauthorizedException('Invalid token');
                } else if (err.message.includes('jwt not active')) {
                    throw new UnauthorizedException('Token not active');
                }
            }

            throw err || new UnauthorizedException('Authentication required');
        }

        const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (requiredRoles && requiredRoles.length > 0) {
            if (!user.role || !requiredRoles.includes(user.role)) {
                throw new UnauthorizedException('Insufficient permissions');
            }
        }

        return user;
    }
}