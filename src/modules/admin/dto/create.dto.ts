import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from 'src/common/entities/admin.entity';

export class CreateAdminDto {
    @ApiProperty({ example: 'admin@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 6 })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ enum: AdminRole, example: AdminRole.ADMIN })
    @IsEnum(AdminRole)
    role: AdminRole;

    @ApiProperty({ example: 'Admin notes', required: false })
    @IsOptional()
    @IsString()
    notes?: string;
}
