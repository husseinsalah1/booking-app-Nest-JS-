import { ConfigModuleOptions } from '@nestjs/config';

export const appConfig: ConfigModuleOptions = {
    isGlobal: true,
    envFilePath: '.env',
};

export const swaggerConfig = {
    title: 'Class Booking API',
    description: 'A NestJS API for managing class bookings with user authentication and credit system',
    version: '1.0',
    path: 'api',
};

export const corsConfig = {
    origin: true,
    credentials: true,
};

export const validationConfig = {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
};

export const getPort = (): number => {
    return parseInt(process.env.PORT || '3000', 10);
};
