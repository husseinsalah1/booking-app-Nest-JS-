import { IsOptional, IsString, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FilterBookingsDto {
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    userId?: string;

    @IsOptional()
    @IsString()
    classId?: string;

    @IsOptional()
    @IsDateString()
    startDate?: string;

    @IsOptional()
    @IsDateString()
    endDate?: string;

    @IsOptional()
    @IsDateString()
    createdAt?: string;

    @IsOptional()
    @IsNumber()
    creditsUsed?: number;

    @IsOptional()
    @IsEnum(['pending', 'confirmed', 'cancelled', 'active'])
    status?: string;
}
