import { IsUUID, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  classId: string;
}

export class CancelBookingDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  bookingId: string;
}

export class UpdateCreditsDto {
  @ApiProperty({ example: 10, minimum: 0 })
  credits: number;
}
