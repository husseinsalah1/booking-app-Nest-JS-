import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from '../../common/entities/user.entity';
import { FilterUsersDto } from './dto/filter.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  private buildWhereClause(
    filterUsersDto: FilterUsersDto,
  ): FindOptionsWhere<User> {
    const { email, firstName, lastName } = filterUsersDto;
    const where: FindOptionsWhere<User> = {};
    if (email) {
      where.email = email;
    }
    if (firstName) {
      where.firstName = firstName;
    }
    if (lastName) {
      where.lastName = lastName;
    }
    return where;
  }
  async find(filterUsersDto: FilterUsersDto): Promise<{ data: User[], pagination: PaginationDto }> {
    const { page, limit, ...restFilterUsersDto } = filterUsersDto;
    const where = this.buildWhereClause(restFilterUsersDto);
    const [users, total] = await this.userRepository.findAndCount({
      where,
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
    return { data: users, pagination };
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async updateCredits(userId: number, credits: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.credits = credits;
    return this.userRepository.save(user);
  }



  async validatePassword(user: User, password: string): Promise<boolean> {
    return user.validatePassword(password);
  }

  async addCredits(userId: number, creditsToAdd: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.credits += creditsToAdd;
    return this.userRepository.save(user);
  }

  async deductCredits(userId: number, creditsToDeduct: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.credits < creditsToDeduct) {
      throw new Error('Insufficient credits');
    }

    user.credits -= creditsToDeduct;
    return this.userRepository.save(user);
  }
}
