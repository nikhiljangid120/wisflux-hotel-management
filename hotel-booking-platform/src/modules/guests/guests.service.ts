import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private readonly guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto): Promise<Guest> {
    const guest = this.guestRepository.create(createGuestDto);
    return await this.guestRepository.save(guest);
  }

  async findAll(): Promise<Guest[]> {
    return await this.guestRepository.find();
  }

}
