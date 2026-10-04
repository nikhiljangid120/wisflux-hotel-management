import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Guest } from '../guests/entities/guest.entity';
import { RoomType } from '../room-types/entities/room-type.entity';
import { RoomPrice } from '../pricing/entities/room-price.entity';
import { BookingStatus } from '../../common/enums/booking-status.enum';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';

@Injectable()
export class BookingsService {  
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly dataSource: DataSource,
  ) {}

  async createHold(dto: CreateBookingHoldDto): Promise<Booking> {
    const checkInDate = new Date(dto.checkIn);
    const checkOutDate = new Date(dto.checkOut);

    if (checkOutDate <= checkInDate) {
      throw new BadRequestException('Check-out date must be after check-in date.');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (checkInDate < today) {
      throw new BadRequestException('Check-in date cannot be in the past.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const roomType = await queryRunner.manager
        .createQueryBuilder(RoomType, 'roomType')
        .setLock('pessimistic_write')
        .where('roomType.id = :roomTypeId', { roomTypeId: dto.roomTypeId })
        .getOne();

      if (!roomType) {
        throw new NotFoundException('Room type not found.');
      }

      const guest = await queryRunner.manager.findOne(Guest, {
        where: { id: dto.guestId },
      });
      if (!guest) {
        throw new NotFoundException('Guest not found.');
      }

      const occupied = await queryRunner.manager
        .createQueryBuilder(Booking, 'booking')
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

      if (occupied >= roomType.capacity) {
        throw new BadRequestException('No availability for this room type in the selected date range.');
      }
      const nightsCount = Math.ceil(
        (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      const priceEntries = await queryRunner.manager.find(RoomPrice, {
        where: {
          room_type_id: dto.roomTypeId,
          date: Between(
            checkInDate,
            new Date(checkOutDate.getTime() - 24 * 60 * 60 * 1000),
          ),
        },
      });

      const priceMap = new Map<string, number>();
      for (const entry of priceEntries) {
        const dateStr =
          entry.date instanceof Date
            ? entry.date.toISOString().split('T')[0]
            : String(entry.date);
        priceMap.set(dateStr, Number(entry.price));
      }

      let totalPrice = 0;
      for (let i = 0; i < nightsCount; i++) {
        const currentNight = new Date(checkInDate.getTime() + i * 24 * 60 * 60 * 1000);
        const currentNightStr = currentNight.toISOString().split('T')[0];

        if (priceMap.has(currentNightStr)) {
          totalPrice += priceMap.get(currentNightStr)!;
        } else {
          totalPrice += Number(roomType.base_price);
        }
      }

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const booking = queryRunner.manager.create(Booking, {
        guest_id: dto.guestId,
        room_type_id: dto.roomTypeId,
        check_in: checkInDate,
        check_out: checkOutDate,
        status: BookingStatus.PENDING,
        total_price: totalPrice,
        expires_at: expiresAt,
      });

      const savedBooking = await queryRunner.manager.save(Booking, booking);

      await queryRunner.commitTransaction();

      return savedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Booking[]> {
    return await this.bookingRepository.find();
  }

  async confirmBooking(id: number): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      const booking = await queryRunner.manager
        .createQueryBuilder(Booking, 'booking')
        .setLock('pessimistic_write')
        .where('booking.id = :id', { id })
        .getOne();

      if (!booking) {
        throw new NotFoundException('Booking not found.');
      }

      if (booking.status !== BookingStatus.PENDING) {
        throw new BadRequestException('Only pending bookings can be confirmed.');
      }

      // Expiry check
      if (booking.expires_at && booking.expires_at < now) {
        booking.status = BookingStatus.EXPIRED;
        await queryRunner.manager.save(Booking, booking);
        await queryRunner.commitTransaction();
        throw new BadRequestException('Booking hold has expired.');
      }

      booking.status = BookingStatus.CONFIRMED;

      const updatedBooking = await queryRunner.manager.save(Booking, booking);
      await queryRunner.commitTransaction();

      return updatedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancelBooking(id: number): Promise<Booking> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const now = new Date();

      const booking = await queryRunner.manager
        .createQueryBuilder(Booking, 'booking')
        .setLock('pessimistic_write')
        .where('booking.id = :id', { id })
        .getOne();

      if (!booking) {
        throw new NotFoundException('Booking not found.');
      }

      if (booking.status === BookingStatus.CANCELLED) {
        throw new BadRequestException('Booking is already cancelled.');
      }

      if (booking.status === BookingStatus.EXPIRED) {
        throw new BadRequestException('Expired booking cannot be cancelled.');
      }

      // Strict expiry handling for PENDING bookings
      if (booking.status === BookingStatus.PENDING && booking.expires_at && booking.expires_at < now) {
        booking.status = BookingStatus.EXPIRED;
        await queryRunner.manager.save(Booking, booking);
        await queryRunner.commitTransaction();
        throw new BadRequestException('Booking hold has expired.');
      }

      if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
        throw new BadRequestException('Booking cannot be cancelled from its current state.');
      }

      // Update status = CANCELLED
      booking.status = BookingStatus.CANCELLED;

      // Save booking and commit transaction
      const updatedBooking = await queryRunner.manager.save(Booking, booking);
      await queryRunner.commitTransaction();

      return updatedBooking;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
