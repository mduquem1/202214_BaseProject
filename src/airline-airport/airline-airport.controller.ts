import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { AirlineDto } from '../airline/airline.dto';
import { AirportEntity } from '../airport/airport.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptor/business-errors-interceptor';
import { AirlineAirportServices } from './airline-airport.service';

@Controller('airlines')
@UseInterceptors(BusinessErrorsInterceptor)
export class AirlineAirportController {
  constructor(private readonly airlineAirportService: AirlineAirportServices) {}

  @Post(':airlineId/airports/:airportId')
  async addAirportToAirline(
    @Param('airlineId') airlineId: string,
    @Param('airportId') aiportId: string,
  ) {
    return await this.airlineAirportService.addAirportToAirline(
      airlineId,
      aiportId,
    );
  }

  @Get(':airlineId/airports/:aiportId')
  async findAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('aiportId') aiportId: string,
  ) {
    return await this.airlineAirportService.findAirportFromAirline(
      airlineId,
      aiportId,
    );
  }

  @Get(':airlineId/airports')
  async findAirportsFromAirline(@Param('airlineId') airlineId: string) {
    return await this.airlineAirportService.findAirportsFromAirline(airlineId);
  }

  @Put(':airlineId/airports')
  async updateAirportsFromAirline(
    @Body() airportsDto: AirlineDto[],
    @Param('airportId') airportId: string,
  ) {
    const airports = plainToInstance(AirportEntity, airportsDto);
    return await this.airlineAirportService.updateAirportsFromAirline(
      airportId,
      airports,
    );
  }

  @Delete(':airlineId/airports/:aiportId')
  @HttpCode(204)
  async deleteAirportFromAirline(
    @Param('airlineId') airlineId: string,
    @Param('aiportId') aiportId: string,
  ) {
    return await this.airlineAirportService.deleteAirportFromAirline(
      airlineId,
      aiportId,
    );
  }
}
