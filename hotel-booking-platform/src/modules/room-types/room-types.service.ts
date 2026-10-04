import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomType } from './entities/room-type.entity';
import { CreateRoomTypeDto } from './dto/create-room-type.dto';

@Injectable()
export class RoomTypesService {
  constructor(
    @InjectRepository(RoomType)
    private readonly roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    const roomType = this.roomTypeRepository.create(createRoomTypeDto);
    return await this.roomTypeRepository.save(roomType);
  }

  async findAll(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find();
  }
}
