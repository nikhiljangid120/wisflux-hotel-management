import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Guest } from '../../guests/entities/guest.entity';
import { RoomType } from '../../room-types/entities/room-type.entity';

import { BookingStatus } from '../../../common/enums/booking-status.enum';

// Composite index: speeds up the core overlap-check query in BookingsService.createHold()
// WHERE room_type_id = X AND check_in < Y AND check_out > Z
@Index('IDX_bookings_room_type_dates', ['room_type_id', 'check_in', 'check_out'])
// Index on status: speeds up filtering CONFIRMED / PENDING bookings
@Index('IDX_bookings_status', ['status'])
// Index on expires_at: speeds up the cron job that purges expired PENDING holds
@Index('IDX_bookings_expires_at', ['expires_at'])
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'guest_id', type: 'integer' })
  guest_id: number;

  @ManyToOne(() => Guest, (guest) => guest.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'guest_id' })
  guest: Guest;

  @Column({ name: 'room_type_id', type: 'integer' })
  room_type_id: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'room_type_id' })
  room_type: RoomType;

  @Column({ type: 'date' })
  check_in: Date;

  @Column({ type: 'date' })
  check_out: Date;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_price: number;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
