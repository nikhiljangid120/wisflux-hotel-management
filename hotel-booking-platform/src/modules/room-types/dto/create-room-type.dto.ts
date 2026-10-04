import {
  IsNotEmpty,
  IsString,
  IsInt,
  IsOptional,
  Min,
  IsPositive,
  IsNumber,
} from 'class-validator';

export class CreateRoomTypeDto {
  @IsNotEmpty({ message: 'Hotel ID is required.' })
  @IsInt({ message: 'Hotel ID must be an integer.' })
  hotel_id: number;

  @IsNotEmpty({ message: 'Room type name is required.' })
  @IsString({ message: 'Room type name must be a string.' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsNotEmpty({ message: 'Capacity is required.' })
  @IsInt({ message: 'Capacity must be an integer.' })
  @Min(1, { message: 'Capacity must be at least 1.' })
  capacity: number;

  @IsNotEmpty({ message: 'Base price is required.' })
  @IsNumber({}, { message: 'Base price must be a number.' })
  @IsPositive({ message: 'Base price must be a positive number.' })
  base_price: number;
}
