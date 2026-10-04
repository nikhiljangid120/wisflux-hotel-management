import { IsNotEmpty, IsInt, IsISO8601 } from 'class-validator';

export class CreateBookingHoldDto {
  @IsNotEmpty({ message: 'Guest ID is required.' })
  @IsInt({ message: 'Guest ID must be an integer.' })
  guestId: number;

  @IsNotEmpty({ message: 'Room type ID is required.' })
  @IsInt({ message: 'Room type ID must be an integer.' })
  roomTypeId: number;

  @IsNotEmpty({ message: 'Check-in date is required.' })
  @IsISO8601({}, { message: 'Check-in date must be a valid ISO 8601 date string (YYYY-MM-DD).' })
  checkIn: string;

  @IsNotEmpty({ message: 'Check-out date is required.' })
  @IsISO8601({}, { message: 'Check-out date must be a valid ISO 8601 date string (YYYY-MM-DD).' })
  checkOut: string;
}
