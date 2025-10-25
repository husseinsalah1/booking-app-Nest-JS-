import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { User } from "src/common/entities/user.entity";
import { FilterUsersDto } from "src/modules/user/dto/filter.dto";
import { UserService } from "src/modules/user/user.service";

export async function userSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const userService = app.get(UserService);
    // check if the user table is empty
    const users: { data: User[], pagination: PaginationDto } = await userService.find(new FilterUsersDto());
    if (users.data && users.data.length > 0) {
        console.log('Users already exist skipping...');
        await app.close();
        return;
    }
    // Create one user with email: user@example.com and password: password
    const user = await userService.create({
        email: 'user@example.com',
        password: 'password',
        firstName: 'User',
        lastName: 'Example',
    });
    console.log(`User ${user.email} created`);
    await app.close();
}
