import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Class } from '../../common/entities/class.entity';
import { CreateClassDto, UpdateClassDto, ClassResponseDto } from './dto';
import { FilterClassesDto } from './dto/filter-dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) { }

  async create(createClassDto: CreateClassDto): Promise<Class> {
    const { startTime, endTime } = createClassDto;

    if (new Date(endTime) <= new Date(startTime)) {
      throw new BadRequestException('End time must be after start time');
    }

    const overlappingClass = await this.findOverlappingClass(
      createClassDto.instructor,
      new Date(startTime),
      new Date(endTime),
    );

    if (overlappingClass) {
      throw new BadRequestException('Instructor has overlapping class at this time');
    }

    const classEntity = this.classRepository.create({
      ...createClassDto,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
    });

    return this.classRepository.save(classEntity);
  }

  async findAll(filterClassesDto: FilterClassesDto): Promise<{ data: ClassResponseDto[], pagination: PaginationDto }> {
    const { name, instructor, startTime, endTime, page, limit } = filterClassesDto;
    const [classes, total] = await this.classRepository.findAndCount({
      where: {
        name,
        instructor
      },
      order: { startTime: 'ASC' },
    });
    const pagination: PaginationDto = {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
    return { data: classes, pagination };
  }

  async findById(id: number): Promise<Class> {
    const classEntity = await this.classRepository.findOne({ where: { id } });
    if (!classEntity) {
      throw new NotFoundException('Class not found');
    }
    return classEntity;
  }

  async update(id: number, updateClassDto: UpdateClassDto): Promise<Class> {
    const classEntity = await this.findById(id);

    if (updateClassDto.startTime || updateClassDto.endTime) {
      const startTime = updateClassDto.startTime ? new Date(updateClassDto.startTime) : classEntity.startTime;
      const endTime = updateClassDto.endTime ? new Date(updateClassDto.endTime) : classEntity.endTime;
      const instructor = updateClassDto.instructor || classEntity.instructor;

      if (endTime <= startTime) {
        throw new BadRequestException('End time must be after start time');
      }

      const overlappingClass = await this.findOverlappingClass(
        instructor,
        startTime,
        endTime,
        id,
      );

      if (overlappingClass) {
        throw new BadRequestException('Instructor has overlapping class at this time');
      }
    }

    Object.assign(classEntity, updateClassDto);
    if (updateClassDto.startTime) classEntity.startTime = new Date(updateClassDto.startTime);
    if (updateClassDto.endTime) classEntity.endTime = new Date(updateClassDto.endTime);

    return this.classRepository.save(classEntity);
  }

  async delete(id: number): Promise<void> {
    const classEntity = await this.findById(id);
    await this.classRepository.remove(classEntity);
  }

  async findUpcoming(): Promise<Class[]> {
    const now = new Date();
    return this.classRepository.find({
      where: {
        startTime: Between(now, new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)),
      },
      order: { startTime: 'ASC' },
    });
  }

  private async findOverlappingClass(
    instructor: string,
    startTime: Date,
    endTime: Date,
    excludeId?: number,
  ): Promise<Class | null> {
    const query = this.classRepository
      .createQueryBuilder('class')
      .where('class.instructor = :instructor', { instructor })
      .andWhere(
        '(class.startTime < :endTime AND class.endTime > :startTime)',
        { startTime, endTime }
      );

    if (excludeId) {
      query.andWhere('class.id != :excludeId', { excludeId });
    }

    return query.getOne();
  }

  async incrementBookings(classId: number): Promise<void> {
    await this.classRepository.increment({ id: classId }, 'currentBookings', 1);
  }

  async decrementBookings(classId: number): Promise<void> {
    await this.classRepository.decrement({ id: classId }, 'currentBookings', 1);
  }
}
