import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Admin } from '../../common/entities/admin.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { jwtConfig } from '../../config/jwt.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin]),
        JwtModule.registerAsync(jwtConfig),
    ],
    providers: [AdminService],
    controllers: [AdminController],
    exports: [AdminService],
})
export class AdminModule { }
