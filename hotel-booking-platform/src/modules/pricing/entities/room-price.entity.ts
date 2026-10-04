import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { RoomType } from '../../room-types/entities/room-type.entity';

// Composite unique index: one price entry per room type per day.
// Also speeds up the date range price lookup in BookingsService.createHold().
@Index('IDX_room_prices_room_type_date', ['room_type_id', 'date'], { unique: true })
@Entity('room_prices')
export class RoomPrice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_type_id', type: 'integer' })
  room_type_id: number;

  @ManyToOne(() => RoomType, (roomType) => roomType.prices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'room_type_id' })
  room_type: RoomType;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
