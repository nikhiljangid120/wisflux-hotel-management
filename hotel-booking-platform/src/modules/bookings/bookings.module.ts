import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { Booking } from './entities/booking.entity';
import { Guest } from '../guests/entities/guest.entity';
import { RoomType } from '../room-types/entities/room-type.entity';
import { RoomPrice } from '../pricing/entities/room-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Guest, RoomType, RoomPrice])],
  controllers: [BookingsController],
  providers: [BookingsService]
})
export class BookingsModule {}
