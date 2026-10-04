import { Controller, Post, Body, Get, Patch, ParseIntPipe, Param } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingHoldDto } from './dto/create-booking-hold.dto';
import { Booking } from './entities/booking.entity';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post('hold')
  async createHold(@Body() dto: CreateBookingHoldDto): Promise<Booking> {
    return await this.bookingsService.createHold(dto);
  }

  @Get()
  async findAll(): Promise<Booking[]> {
    return await this.bookingsService.findAll();
  }

  @Patch(':id/confirm')
  confirmBooking(@Param('id', ParseIntPipe)id: number): Promise<Booking> {
    return this.bookingsService.confirmBooking(id);
  }

  @Patch(':id/cancel')
  cancelBooking(@Param('id', ParseIntPipe)id: number): Promise<Booking> {
    return this.bookingsService.cancelBooking(id);
  }
}
