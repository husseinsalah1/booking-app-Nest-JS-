import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request, Put, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';
import { CreateBookingDto } from '../../common/dto/booking.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { Booking } from '../../common/entities/booking.entity';
import { FilterBookingsDto } from './dto/filter.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { ResponseDto } from '../../common/dto/response.dto';

const adminsOnly = ['admin', 'super_admin'];
@ApiTags('Bookings')
@Controller('bookings')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) { }

  @Post()
  @ApiOperation({ summary: 'Book a class' })
  @ApiResponse({ status: 201, description: 'Class successfully booked', type: Booking })
  @ApiResponse({ status: 400, description: 'Bad request - insufficient credits, class full, or overlapping booking' })
  @ApiResponse({ status: 404, description: 'Class not found' })
  async createBooking(@Request() req, @Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingService.createBooking(req.user.id, createBookingDto);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: 'Get user bookings' })
  @ApiResponse({ status: 200, description: 'User bookings retrieved successfully', type: [Booking] })
  async getUserBookings(@Request() req): Promise<Booking[]> {
    return this.bookingService.getUserBookings(req.user.id);
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking retrieved successfully', type: Booking })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async getBookingById(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.getBookingById(id, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Cancel booking' })
  @ApiResponse({ status: 200, description: 'Booking successfully cancelled', type: Booking })
  @ApiResponse({ status: 400, description: 'Cannot cancel booking less than 2 hours before class' })
  @ApiResponse({ status: 404, description: 'Booking not found' })
  async cancelBooking(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingService.cancelBooking(req.user.id, id);
  }


  @Get('')
  @ApiOperation({ summary: 'Get all bookings (admin)' })
  @ApiResponse({ status: 200, description: 'All bookings retrieved successfully', type: [Booking] })
  @Roles(...adminsOnly)
  async getAllBookingsForAdmin(@Query() filterBookingsDto: FilterBookingsDto): Promise<ResponseDto<Booking[]>> {
    const { data, pagination } = await this.bookingService.getAllBookings(filterBookingsDto);
    return {
      data: data,
      pagination: pagination,
      message: 'Bookings retrieved successfully',
    };
  }
}
