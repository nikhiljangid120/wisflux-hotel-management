import {IsNotEmpty, IsInt, IsISO8601,} from 'class-validator';

import { Type } from 'class-transformer';

export class AvailabilitySearchDto {
  @Type(() => Number)
  @IsNotEmpty({
    message: 'Room type ID is required.',
  })
  @IsInt({
    message: 'Room type ID must be an integer.' ,
  })
  roomTypeId: number;

  @IsNotEmpty({
    message: 'Check-in date is required.',
  })
  @IsISO8601(
    {},
    {
      message:
        'Check-in date must be valid (YYYY-MM-DD).',
    },
  )
  checkIn: string;

  @IsNotEmpty({
    message: 'Check-out date is required.',
  })
  @IsISO8601(
    {},
    {
      message:
        'Check-out date must be valid (YYYY-MM-DD).',
    },
  )
  checkOut: string;
}