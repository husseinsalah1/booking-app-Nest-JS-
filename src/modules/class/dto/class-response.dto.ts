import { ApiProperty } from '@nestjs/swagger';

export class ClassResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Yoga Class' })
    name: string;

    @ApiProperty({ example: 'A relaxing yoga session' })
    description: string;

    @ApiProperty({ example: 'Jane Smith' })
    instructor: string;

    @ApiProperty({ example: '2025-10-10T00:00:00.000Z' })
    startTime: Date;

    @ApiProperty({ example: '2025-12-12T00:00:00.000Z' })
    endTime: Date;

    @ApiProperty({ example: 10 })
    capacity: number;

    @ApiProperty({ example: 500 })
    creditsRequired: number;

    @ApiProperty({ example: 0 })
    currentBookings: number;

    @ApiProperty({ example: '2025-10-24T17:11:15.564Z' })
    createdAt: Date;

    @ApiProperty({ example: '2025-10-24T17:11:15.564Z' })
    updatedAt: Date;
}
