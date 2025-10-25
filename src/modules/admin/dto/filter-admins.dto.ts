import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { AdminRole } from 'src/common/entities/admin.entity';

export class FilterAdminsDto {
    @ApiPropertyOptional({ example: 'admin@example.com' })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({ example: 'John' })
    @IsOptional()
    @IsString()
    firstName?: string;

    @ApiPropertyOptional({ example: 'Doe' })
    @IsOptional()
    @IsString()
    lastName?: string;

    @ApiPropertyOptional({ example: 'admin', enum: AdminRole })
    @IsOptional()
    @IsString()
    role?: AdminRole;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    isActive?: boolean;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    page: number = 1;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    limit: number = 10;
}
