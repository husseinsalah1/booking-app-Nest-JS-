import { IsString, IsOptional, IsNumber, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClassDto {
    @ApiProperty({ example: 'Yoga Class', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'A relaxing yoga session', required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: 'Jane Smith', required: false })
    @IsOptional()
    @IsString()
    instructor?: string;

    @ApiProperty({ example: '2024-01-15T10:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    startTime?: string;

    @ApiProperty({ example: '2024-01-15T11:00:00Z', required: false })
    @IsOptional()
    @IsDateString()
    endTime?: string;

    @ApiProperty({ example: 20, minimum: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    capacity?: number;

    @ApiProperty({ example: 1, minimum: 1, required: false })
    @IsOptional()
    @IsNumber()
    @Min(1)
    creditsRequired?: number;
}