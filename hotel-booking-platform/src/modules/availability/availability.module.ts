import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityController } from './availability.controller';
import { AvailabilityService } from './availability.service';
import { RoomType } from '../room-types/entities/room-type.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomType, Booking])],
  controllers: [AvailabilityController],
  providers: [AvailabilityService]
})
export class AvailabilityModule {}
