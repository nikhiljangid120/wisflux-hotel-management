import { Controller, Get, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { AvailabilitySearchDto } from './dto/availability-search.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('search')
  async searchAvailability(@Query() dto: AvailabilitySearchDto) {
    return await this.availabilityService.searchAvailability(dto);
  }
}
