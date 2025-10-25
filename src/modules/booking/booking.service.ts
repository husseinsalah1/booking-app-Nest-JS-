import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, MoreThanOrEqual, Equal } from 'typeorm';
import { Booking, BookingStatus } from '../../common/entities/booking.entity';
import { Class } from '../../common/entities/class.entity';
import { User } from '../../common/entities/user.entity';
import { CreateBookingDto } from '../../common/dto/booking.dto';
import { UserService } from '../user/user.service';
import { ClassService } from '../class/class.service';
import { FilterBookingsDto } from './dto/filter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userService: UserService,
    private readonly classService: ClassService,
  ) { }

  async createBooking(userId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { classId } = createBookingDto;

    const classEntity = await this.classService.findById(classId);
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (classEntity.isFull) {
      throw new BadRequestException('Class is full');
    }

    if (user.credits < classEntity.creditsRequired) {
      throw new BadRequestException(`Insufficient credits. You have ${user.credits} credits but the class requires ${classEntity.creditsRequired} credits`);
    }

    const overlappingBooking = await this.findOverlappingBooking(userId, classEntity.startTime, classEntity.endTime);
    if (overlappingBooking) {
      throw new BadRequestException('You have an overlapping class booking');
    }

    const existingBooking = await this.bookingRepository.findOne({
      where: {
        userId,
        classId,
        status: BookingStatus.ACTIVE,
      },
    });

    if (existingBooking) {
      throw new BadRequestException('You have already booked this class');
    }

    const booking = this.bookingRepository.create({
      userId,
      classId,
      creditsUsed: classEntity.creditsRequired,
      status: BookingStatus.ACTIVE,
    });

    const savedBooking = await this.bookingRepository.save(booking);

    await this.userService.deductCredits(userId, classEntity.creditsRequired);

    await this.classService.incrementBookings(classId);

    return savedBooking;
  }

  async cancelBooking(userId: string, bookingId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, userId },
      relations: ['class'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== BookingStatus.ACTIVE) {
      throw new BadRequestException('Booking is not active');
    }

    const now = new Date();
    const classStartTime = booking.class.startTime;
    const hoursUntilClass = (classStartTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilClass <= 2) {
      throw new BadRequestException('Cannot cancel booking less than 2 hours before class');
    }

    booking.status = BookingStatus.CANCELLED;
    booking.cancelledAt = now;

    const updatedBooking = await this.bookingRepository.save(booking);

    await this.userService.addCredits(userId, booking.creditsUsed);

    await this.classService.decrementBookings(booking.classId);

    return updatedBooking;
  }

  async getUserBookings(userId: string): Promise<Booking[]> {
    return this.bookingRepository.find({
      where: { userId },
      relations: {
        class: true,
        user: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async getBookingById(bookingId: string, userId: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId, userId },
      relations: ['class'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  private buildWhereClause(filterBookingsDto: FilterBookingsDto): FindOptionsWhere<Booking> {
    const { classId, userId, status, createdAt, creditsUsed } = filterBookingsDto;
    const where: FindOptionsWhere<Booking> = {};
    if (classId) {
      where.classId = classId;
    }
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status as BookingStatus;
    }
    if (createdAt) {
      where.createdAt = MoreThanOrEqual(new Date(createdAt as string));
    }
    if (creditsUsed) {
      where.creditsUsed = Equal(creditsUsed);
    }
    return where;
  }
  async getAllBookings(filterBookingsDto: FilterBookingsDto): Promise<{ data: Booking[], pagination: PaginationDto }> {
    const { page, limit, ...restFilterBookingsDto } = filterBookingsDto;
    const where = this.buildWhereClause(restFilterBookingsDto);
    const [bookings, total] = await this.bookingRepository.findAndCount({
      where,
      relations: ['user', 'class'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit || 0,
      take: limit || 10,
    });
    const pagination: PaginationDto = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
    return { data: bookings, pagination };
  }

  private async findOverlappingBooking(
    userId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<Booking | null> {
    return this.bookingRepository.findOne({
      where: {
        userId,
        status: BookingStatus.ACTIVE,
      },
      relations: ['class'],
    }).then(booking => {
      if (!booking) return null;

      const bookingStart = booking.class.startTime;
      const bookingEnd = booking.class.endTime;

      const overlaps = bookingStart < endTime && bookingEnd > startTime;
      return overlaps ? booking : null;
    });
  }

}
