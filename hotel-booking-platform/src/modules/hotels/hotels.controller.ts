import { Controller, Get, Post, Body } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@Controller('hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  async create(@Body() createHotelDto: CreateHotelDto): Promise<Hotel> {
    return await this.hotelsService.create(createHotelDto);
  }

  @Get()
  async findAll(): Promise<Hotel[]> {
    return await this.hotelsService.findAll();
  }
}
