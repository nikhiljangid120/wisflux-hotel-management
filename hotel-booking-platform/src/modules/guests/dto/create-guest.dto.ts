import { IsNotEmpty, IsString, MinLength, IsEmail } from 'class-validator';

export class CreateGuestDto {
  @IsNotEmpty({ message: 'Full name is required.' })
  @IsString({ message: 'Full name must be a string.' })
  @MinLength(2, { message: 'Full name must be at least 2 characters long.' })
  full_name: string;

  @IsNotEmpty({ message: 'Email address is required.' })
  @IsEmail({}, { message: 'Please provide a valid email address.' })
  email: string;

  @IsNotEmpty({ message: 'Phone number is required.' })
  @IsString({ message: 'Phone number must be a string.' })
  @MinLength(10, { message: 'Phone number must be at least 10 characters long.' })
  phone_number: string;
}
