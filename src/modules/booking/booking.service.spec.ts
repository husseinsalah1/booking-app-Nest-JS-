import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BookingService } from './booking.service';
import { Booking } from '../../common/entities/booking.entity';
import { Class } from '../../common/entities/class.entity';
import { User } from '../../common/entities/user.entity';
import { UserService } from '../user/user.service';
import { ClassService } from '../class/class.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('BookingService', () => {
    let service: BookingService;
    let userService: UserService;
    let classService: ClassService;

    const mockBookingRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
    };

    const mockClassRepository = {
        findOne: jest.fn(),
    };

    const mockUserRepository = {
        findOne: jest.fn(),
    };

    const mockUserService = {
        findById: jest.fn(),
        deductCredits: jest.fn(),
        addCredits: jest.fn(),
    };

    const mockClassService = {
        findById: jest.fn(),
        incrementBookings: jest.fn(),
        decrementBookings: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookingService,
                {
                    provide: getRepositoryToken(Booking),
                    useValue: mockBookingRepository,
                },
                {
                    provide: getRepositoryToken(Class),
                    useValue: mockClassRepository,
                },
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: UserService,
                    useValue: mockUserService,
                },
                {
                    provide: ClassService,
                    useValue: mockClassService,
                },
            ],
        }).compile();

        service = module.get<BookingService>(BookingService);
        userService = module.get<UserService>(UserService);
        classService = module.get<ClassService>(ClassService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createBooking', () => {
        const userId = 'user-123';
        const classId = 'class-123';
        const createBookingDto = { classId };

        const mockUser = {
            id: userId,
            credits: 10,
        } as User;

        const mockClass = {
            id: classId,
            capacity: 20,
            currentBookings: 5,
            creditsRequired: 2,
            startTime: new Date('2024-01-15T10:00:00Z'),
            endTime: new Date('2024-01-15T11:00:00Z'),
            isFull: false,
        } as Class;

        const mockBooking = {
            id: 'booking-123',
            userId,
            classId,
            creditsUsed: 2,
            status: 'active',
        } as Booking;

        beforeEach(() => {
            mockUserService.findById.mockResolvedValue(mockUser);
            mockClassService.findById.mockResolvedValue(mockClass);
            mockBookingRepository.findOne.mockResolvedValue(null);
            mockBookingRepository.create.mockReturnValue(mockBooking);
            mockBookingRepository.save.mockResolvedValue(mockBooking);
        });

        it('should create a booking successfully', async () => {
            const result = await service.createBooking(userId, createBookingDto);

            expect(mockUserService.findById).toHaveBeenCalledWith(userId);
            expect(mockClassService.findById).toHaveBeenCalledWith(classId);
            expect(mockUserService.deductCredits).toHaveBeenCalledWith(userId, 2);
            expect(mockClassService.incrementBookings).toHaveBeenCalledWith(classId);
            expect(result).toEqual(mockBooking);
        });

        it('should throw BadRequestException when user has insufficient credits', async () => {
            mockUser.credits = 1;

            await expect(service.createBooking(userId, createBookingDto))
                .rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException when class is full', async () => {
            mockClass.currentBookings = 20;

            await expect(service.createBooking(userId, createBookingDto))
                .rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException when user already booked the class', async () => {
            mockBookingRepository.findOne.mockResolvedValue(mockBooking);

            await expect(service.createBooking(userId, createBookingDto))
                .rejects.toThrow(BadRequestException);
        });
    });

    describe('cancelBooking', () => {
        const userId = 'user-123';
        const bookingId = 'booking-123';
        const mockBooking = {
            id: bookingId,
            userId,
            classId: 'class-123',
            status: 'active',
            creditsUsed: 2,
            class: {
                startTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
            },
        } as Booking;

        beforeEach(() => {
            mockBookingRepository.findOne.mockResolvedValue(mockBooking);
            mockBookingRepository.save.mockResolvedValue({ ...mockBooking, status: 'cancelled' });
        });

        it('should cancel booking successfully when more than 2 hours before class', async () => {
            const result = await service.cancelBooking(userId, bookingId);

            expect(mockUserService.addCredits).toHaveBeenCalledWith(userId, 2);
            expect(mockClassService.decrementBookings).toHaveBeenCalledWith('class-123');
            expect(result.status).toBe('cancelled');
        });

        it('should throw BadRequestException when less than 2 hours before class', async () => {
            mockBooking.class.startTime = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now

            await expect(service.cancelBooking(userId, bookingId))
                .rejects.toThrow(BadRequestException);
        });

        it('should throw NotFoundException when booking not found', async () => {
            mockBookingRepository.findOne.mockResolvedValue(null);

            await expect(service.cancelBooking(userId, bookingId))
                .rejects.toThrow(NotFoundException);
        });
    });
});
