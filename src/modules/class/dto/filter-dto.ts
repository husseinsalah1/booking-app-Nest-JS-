import { IsDateString, IsNumber, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FilterClassesDto {
    @ApiProperty({ example: 'Yoga Class', required: false })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ example: 'Jane Smith', required: false })
    @IsOptional()
    @IsString()
    instructor?: string;

    @ApiProperty({ example: '2025-10-10T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    startTime?: string;

    @ApiProperty({ example: '2025-10-10T00:00:00.000Z', required: false })
    @IsOptional()
    @IsDateString()
    endTime?: string;

    @ApiProperty({ example: 1, required: false })
    @IsOptional()
    @IsNumber()
    page?: number = 1;

    @ApiProperty({ example: 10, required: false })
    @IsOptional()
    @IsNumber()
    limit?: number = 10;
}