import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { AdminService } from '../modules/admin/admin.service';
import { CreateAdminDto } from '../modules/admin/dto/create.dto';
import { AdminRole } from '../common/entities/admin.entity';

export async function superAdminSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const adminService = app.get(AdminService);
    // check if super admin already exists
    const existingSuperAdmin = await adminService.findByEmail('super@admin.com');
    if (existingSuperAdmin) {
        console.log('Super admin already exists skipping...');
        await app.close();
        return;
    }

    const superAdmin: CreateAdminDto = {
        email: 'super@admin.com',
        password: 'password',
        firstName: 'Super',
        lastName: 'Admin',
        role: AdminRole.SUPER_ADMIN,
    };

    await adminService.create(superAdmin);
    console.log('Super admin created');

    await app.close();
}

