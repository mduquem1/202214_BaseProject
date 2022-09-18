import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AirlineEntity } from '../airline/airline.entity';
import { AirportEntity } from '../airport/airport.entity';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';

@Injectable()
export class AirlineAirportServices {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,

    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async addAirportToAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id: airportId },
    });

    if (!airport) {
      throw new BusinessLogicException(
        `The airport with id ${airportId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }
    airline.airports = [...airline.airports, airport];
    return await this.airlineRepository.save(airline);
  }

  async findAirportFromAirline(
    airlineId: string,
    airportId: string,
  ): Promise<AirportEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: {
        id: airlineId,
      },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    const airport: AirportEntity = await this.airportRepository.findOne({
      where: {
        id: airportId,
      },
      relations: ['airlines'],
    });

    if (!airport) {
      throw new BusinessLogicException(
        `The airport with id ${airportId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    const airlineAirport: AirportEntity = airline.airports.find(
      (e) => e.id === airport.id,
    );

    if (!airlineAirport) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} is not associated with airport with id ${airportId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    return airlineAirport;
  }

  async findAirportsFromAirline(airlineId: string): Promise<AirportEntity[]> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id: airlineId },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    return airline.airports;
  }

  async updateAirportsFromAirline(
    airlineId: string,
    airports: AirportEntity[],
  ): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: {
        id: airlineId,
      },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }
    for (let i = 0; i < airports.length; i++) {
      const airportId = airports[i].id;
      const airport: AirportEntity = await this.airportRepository.findOne({
        where: { id: airportId },
      });

      if (!airport)
        throw new BusinessLogicException(
          `The airport with id ${airportId} has not been found`,
          BusinessError.NOT_FOUND,
        );
    }

    airline.airports = [...airline.airports, ...airports];
    return await this.airlineRepository.save(airline);
  }

  async deleteAirportFromAirline(airlineId: string, airportId: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: {
        id: airlineId,
      },
      relations: ['airports'],
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${airlineId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    const airport: AirportEntity = await this.airportRepository.findOne({
      where: {
        id: airportId,
      },
    });

    if (!airport) {
      throw new BusinessLogicException(
        `The airport with id ${airportId} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    const airlineAirport: AirportEntity = airline.airports.find(
      (e) => e.id === airport.id,
    );

    if (!airlineAirport) {
      throw new BusinessLogicException(
        `The airport with id ${airportId} is not associated with airline with id ${airlineId}`,
        BusinessError.PRECONDITION_FAILED,
      );
    }

    const newAirports =  airline.airports.filter((e) => e.id != airport.id);

    airline.airports = newAirports;

    return await this.airlineRepository.save(airline);
  }
}
