import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, any> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        return next.handle().pipe(
            map((responseData) => {
                const hasDataField = Object.prototype.hasOwnProperty.call(responseData, 'data');
                const hasMessageField = Object.prototype.hasOwnProperty.call(responseData, 'message');
                const hasPaginationField = Object.prototype.hasOwnProperty.call(responseData, 'pagination');
                return {
                    success: true,
                    message: hasMessageField
                        ? responseData.message
                        : 'Request successful',
                    data: hasDataField
                        ? responseData.data
                        : (hasMessageField && Object.keys(responseData).length === 1 ? null : responseData),
                    pagination: hasPaginationField
                        ? responseData.pagination
                        : undefined,
                    statusCode: 200,
                };
            }),
        );
    }
}
