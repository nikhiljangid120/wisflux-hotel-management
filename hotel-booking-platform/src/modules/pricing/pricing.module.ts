import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingController } from './pricing.controller';
import { PricingService } from './pricing.service';
import { RoomPrice } from './entities/room-price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomPrice])],
  controllers: [PricingController],
  providers: [PricingService]
})
export class PricingModule {}
