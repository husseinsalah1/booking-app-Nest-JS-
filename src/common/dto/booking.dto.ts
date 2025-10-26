import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking.entity';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  classId: number;
}

export class CancelBookingDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  bookingId: number;
}

export class UpdateCreditsDto {
  @ApiProperty({ example: 10, minimum: 0 })
  credits: number;
}
