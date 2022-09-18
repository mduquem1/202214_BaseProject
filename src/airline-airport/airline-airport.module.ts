import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportController } from './airline-airport.controller';
import { AirlineAirportServices } from './airline-airport.service';

@Module({
  imports: [TypeOrmModule.forFeature([AirlineEntity, AirportEntity])],
  providers: [AirlineAirportServices],
  controllers: [AirlineAirportController]
})
export class AirlineAirportModule {}
