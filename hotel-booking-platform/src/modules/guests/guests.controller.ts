import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateGuestDto } from './dto/create-guest.dto';
import { Guest } from './entities/guest.entity';
import { GuestsService } from './guests.service';

@Controller('guests')
export class GuestsController {
    constructor(private readonly guestsService: GuestsService) {}

    @Post()
    async create(@Body() createGuestDto: CreateGuestDto): Promise<Guest> {
        return await this.guestsService.create(createGuestDto);
    }

    @Get()
    async findAll(): Promise<Guest[]>{
        return await this.guestsService.findAll();
    }
}
