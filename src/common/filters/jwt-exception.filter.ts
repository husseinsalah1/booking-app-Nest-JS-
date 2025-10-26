import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    UnauthorizedException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class JwtExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.UNAUTHORIZED;
        let message = 'Authentication failed';
        let errorCode = 'AUTH_ERROR';

        if (exception instanceof UnauthorizedException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                message = (exceptionResponse as any).message || exceptionResponse;
            }

            if (message.includes('expired') || message.includes('expiration')) {
                errorCode = 'TOKEN_EXPIRED';
                message = 'Your session has expired. Please log in again.';
            } else if (message.includes('invalid') || message.includes('malformed')) {
                errorCode = 'INVALID_TOKEN';
                message = 'Invalid authentication token. Please log in again.';
            } else if (message.includes('not active')) {
                errorCode = 'TOKEN_NOT_ACTIVE';
                message = 'Authentication token is not active.';
            } else if (message.includes('required')) {
                errorCode = 'AUTH_REQUIRED';
                message = 'Authentication is required to access this resource.';
            } else if (message.includes('permissions')) {
                errorCode = 'INSUFFICIENT_PERMISSIONS';
                message = 'You do not have sufficient permissions to access this resource.';
            }
        } else if (exception instanceof Error) {
            const errorMessage = exception.message.toLowerCase();

            if (errorMessage.includes('jwt expired') || errorMessage.includes('token expired')) {
                status = HttpStatus.UNAUTHORIZED;
                message = 'Your session has expired. Please log in again.';
                errorCode = 'TOKEN_EXPIRED';
            } else if (errorMessage.includes('jwt malformed') || errorMessage.includes('invalid token')) {
                status = HttpStatus.UNAUTHORIZED;
                message = 'Invalid authentication token. Please log in again.';
                errorCode = 'INVALID_TOKEN';
            } else if (errorMessage.includes('jwt not active')) {
                status = HttpStatus.UNAUTHORIZED;
                message = 'Authentication token is not active.';
                errorCode = 'TOKEN_NOT_ACTIVE';
            } else {
                status = HttpStatus.INTERNAL_SERVER_ERROR;
                message = 'Internal server error';
                errorCode = 'INTERNAL_ERROR';
            }
        }

        const errorResponse = {
            success: false,
            message,
            errorCode,
            data: null,
            statusCode: status,
            path: request.url,
            method: request.method,
            timestamp: new Date().toISOString(),
        };

        response.status(status).json(errorResponse);
    }
}
