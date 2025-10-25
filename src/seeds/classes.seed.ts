import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClassService } from '../modules/class/class.service';
import { CreateClassDto } from '../modules/class/dto/create.dto';
import { UpdateClassDto } from '../modules/class/dto/update.dto';
import { FilterClassesDto } from '../modules/class/dto/filter-dto';
import { ClassResponseDto } from '../modules/class/dto/class-response.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

export async function classesSeed() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const classService = app.get(ClassService);
    // check if the classes table is empty
    const classes: { data: ClassResponseDto[], pagination: PaginationDto } = await classService.findAll(new FilterClassesDto());
    if (classes.data && classes.data.length > 0) {
        console.log('Classes already exist skipping...');
        await app.close();
        return;
    }
    const classesToCreate: CreateClassDto[] = [
        {
            name: 'Pilates Class',
            description: 'A challenging pilates session',
            instructor: 'John Doe',
            startTime: '2025-10-24T11:00:00Z',
            endTime: '2025-10-24T12:00:00Z',
            capacity: 20,
            creditsRequired: 100,
        },
    ];
    for (const classData of classesToCreate) {
        const classEntity = await classService.create(classData);
        console.log(`Class ${classEntity.name} created`);
    }
    console.log('Classes created successfully');
    await app.close();
}
