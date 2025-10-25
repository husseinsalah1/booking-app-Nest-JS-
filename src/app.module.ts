import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ClassModule } from './modules/class/class.module';
import { BookingModule } from './modules/booking/booking.module';
import { AdminModule } from './modules/admin/admin.module';
import { getDatabaseConfig } from './config/database.config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    ClassModule,
    BookingModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }