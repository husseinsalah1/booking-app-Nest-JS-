import { ApiProperty } from '@nestjs/swagger';
import { AdminRole } from '../../../common/entities/admin.entity';

export class AdminResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({ enum: AdminRole })
    role: AdminRole;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}