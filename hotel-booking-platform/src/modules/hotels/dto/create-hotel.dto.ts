import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty({ message: 'Hotel name is required.' })
  @IsString({ message: 'Hotel name must be a string.' })
  @MinLength(2, { message: 'Hotel name must be at least 2 characters long.' })
  name: string;

  @IsNotEmpty({ message: 'City is required.' })
  @IsString({ message: 'City must be a string.' })
  city: string;

  @IsNotEmpty({ message: 'Address is required.' })
  @IsString({ message: 'Address must be a string.' })
  address: string;
}
