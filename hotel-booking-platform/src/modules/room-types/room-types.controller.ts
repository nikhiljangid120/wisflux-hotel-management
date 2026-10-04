import { Controller, Get, Post, Body } from '@nestjs/common';
import { RoomTypesService } from './room-types.service';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';
import { RoomType } from './entities/room-type.entity';

@Controller('room-types')
export class RoomTypesController {
  constructor(private readonly roomTypesService: RoomTypesService) {}

  @Post()
  async create(@Body() createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    return await this.roomTypesService.create(createRoomTypeDto);
  }

  @Get()
  async findAll(): Promise<RoomType[]> {
    return await this.roomTypesService.findAll();
  }
}
