import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../../common/entities/booking.entity';
import { Class } from '../../common/entities/class.entity';
import { User } from '../../common/entities/user.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { UserService } from '../user/user.service';
import { ClassService } from '../class/class.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Class, User])],
  providers: [BookingService, UserService, ClassService],
  controllers: [BookingController],
  exports: [BookingService],
})
export class BookingModule { }
