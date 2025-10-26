import {
    Injectable,
    NotFoundException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Admin } from '../../common/entities/admin.entity';
import { UpdateAdminDto } from './dto/update.dto';
import { AdminResponseDto } from './dto/admin-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminDto } from './dto/create.dto';
import { FilterAdminsDto } from './dto/filter-admins.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRepository: Repository<Admin>,
    ) { }

    async create(createAdminDto: CreateAdminDto): Promise<AdminResponseDto> {
        const { email, password, firstName, lastName } = createAdminDto;

        const existingAdmin = await this.adminRepository.findOne({
            where: { email },
        });
        if (existingAdmin) {
            throw new ConflictException('Admin with this email already exists');
        }

        const admin = this.adminRepository.create({
            email,
            password,
            firstName,
            lastName,
            role: createAdminDto.role,
            isActive: true,
        });

        const savedAdmin = await this.adminRepository.save(admin);
        const data = this.formatAdminResponse(savedAdmin);
        return data;
    }

    private buildWhereClause(
        filterAdminsDto: FilterAdminsDto,
    ): FindOptionsWhere<Admin> {
        const { email, firstName, lastName, role, isActive } = filterAdminsDto;
        const where: FindOptionsWhere<Admin> = {};
        if (email) {
            where.email = email;
        }
        if (firstName) {
            where.firstName = firstName;
        }
        if (lastName) {
            where.lastName = lastName;
        }
        if (role) {
            where.role = role;
        }
        if (isActive) {
            where.isActive = isActive;
        }
        return where;
    }

    async getAllAdmins(
        filterAdminsDto: FilterAdminsDto = new FilterAdminsDto(),
    ): Promise<{ data: AdminResponseDto[], pagination: PaginationDto }> {
        const { page, limit } = filterAdminsDto;
        const where = this.buildWhereClause(filterAdminsDto);

        const [admins, total] = await this.adminRepository.findAndCount({
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

        return {
            data: admins.map((admin) => this.formatAdminResponse(admin)),
            pagination,
        };
    }

    async getAdminById(adminId: number): Promise<AdminResponseDto> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        const data = this.formatAdminResponse(admin);
        return data;
    }

    async updateAdmin(
        adminId: number,
        updateAdminDto: UpdateAdminDto,
    ): Promise<AdminResponseDto> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        Object.assign(admin, updateAdminDto);
        const updatedAdmin = await this.adminRepository.save(admin);
        const data = this.formatAdminResponse(updatedAdmin);
        return data;
    }

    async deleteAdmin(adminId: number): Promise<void> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        await this.adminRepository.remove(admin);
    }

    async changePassword(
        adminId: number,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const admin = await this.adminRepository.findOne({
            where: { id: adminId },
        });
        if (!admin) {
            throw new NotFoundException('Admin not found');
        }

        admin.password = changePasswordDto.newPassword;
        await this.adminRepository.save(admin);
    }

    async validateAdmin(adminId: number): Promise<Admin | null> {
        return this.adminRepository.findOne({
            where: { id: adminId, isActive: true },
        });
    }

    async findByEmail(email: string): Promise<Admin | null> {
        return this.adminRepository.findOne({ where: { email } });
    }

    async findById(id: number): Promise<Admin | null> {
        return this.adminRepository.findOne({ where: { id } });
    }

    async validatePassword(admin: Admin, password: string): Promise<boolean> {
        return admin.validatePassword(password);
    }

    private formatAdminResponse(admin: Admin): AdminResponseDto {
        return {
            id: admin.id,
            email: admin.email,
            firstName: admin.firstName,
            lastName: admin.lastName,
            role: admin.role,
            isActive: admin.isActive,
            createdAt: admin.createdAt,
            updatedAt: admin.updatedAt,
        };
    }
}
