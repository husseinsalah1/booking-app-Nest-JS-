import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from './pagination.dto';

export class ResponseDto<T = any> {
    @ApiProperty({ example: true, description: 'Indicates if the request was successful' })
    success?: boolean;

    @ApiPropertyOptional({ example: 'Request successful', description: 'Response message' })
    message?: string;

    @ApiPropertyOptional({
        description: 'Returned data payload (could be user, admin, etc.)',
    })
    data?: T;

    @ApiPropertyOptional({
        description: 'Pagination information',
    })
    pagination?: PaginationDto;

    @ApiPropertyOptional({ example: 200, description: 'HTTP status code' })
    statusCode?: number;
}
