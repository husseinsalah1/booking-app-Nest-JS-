import { IsString, IsNotEmpty, IsDateString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassDto {
    @ApiProperty({ example: 'Yoga Class' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'A relaxing yoga session' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 'Jane Smith' })
    @IsString()
    @IsNotEmpty()
    instructor: string;

    @ApiProperty({ example: '2024-01-15T10:00:00Z' })
    @IsDateString()
    startTime: string;

    @ApiProperty({ example: '2024-01-15T11:00:00Z' })
    @IsDateString()
    endTime: string;

    @ApiProperty({ example: 20, minimum: 1 })
    @IsNumber()
    @Min(1)
    capacity: number;

    @ApiProperty({ example: 1, minimum: 1 })
    @IsNumber()
    @Min(1)
    creditsRequired: number;
}
