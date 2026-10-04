import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from '../room-types/entities/room-type.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { AvailabilitySearchDto } from './dto/availability-search.dto';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
  ) {}

  async searchAvailability(dto: AvailabilitySearchDto) {
    const roomType = await this.roomTypeRepository.findOne({
      where: { id: dto.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundException('Room type not found');
    }

    const occupied = await this.bookingRepository.createQueryBuilder('booking')
      .where('booking.room_type_id = :roomTypeId', { roomTypeId: dto.roomTypeId })
      .andWhere('booking.check_in < :checkOut', { checkOut: dto.checkOut })
      .andWhere('booking.check_out > :checkIn', { checkIn: dto.checkIn })
      .andWhere(
        '(booking.status = :confirmedStatus OR (booking.status = :pendingStatus AND booking.expires_at > :now))',
        {
          confirmedStatus: BookingStatus.CONFIRMED,
          pendingStatus: BookingStatus.PENDING,
          now: new Date(),
        },
      )
      .getCount();

    const capacity = roomType.capacity;
    const available = occupied < capacity;
    const remaining = Math.max(0, capacity - occupied);

    return {
      available,
      capacity,
      occupied,
      remaining,
    };
  }
}
