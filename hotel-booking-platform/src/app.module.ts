import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HotelsModule } from './modules/hotels/hotels.module';
import { RoomTypesModule } from './modules/room-types/room-types.module';
import { GuestsModule } from './modules/guests/guests.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { JobsModule } from './modules/jobs/jobs.module';
import {ConfigModule} from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [HotelsModule, RoomTypesModule, GuestsModule, PricingModule, BookingsModule, AvailabilityModule, JobsModule, 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: () => databaseConfig(),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
