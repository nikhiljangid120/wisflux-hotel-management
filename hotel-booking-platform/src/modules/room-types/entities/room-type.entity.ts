import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { RoomPrice } from '../../pricing/entities/room-price.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('room_types')
export class RoomType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'hotel_id', type: 'integer' })
  hotel_id: number;

  @ManyToOne(() => Hotel, (hotel) => hotel.room_types, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hotel_id' })
  hotel: Hotel;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  base_price: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @OneToMany(() => RoomPrice, (roomPrice) => roomPrice.room_type)
  prices: RoomPrice[];

  @OneToMany(() => Booking, (booking) => booking.room_type)
  bookings: Booking[];
}
