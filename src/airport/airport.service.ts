import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirportEntity } from './airport.entity';

@Injectable()
export class AirportService {
  constructor(
    @InjectRepository(AirportEntity)
    private readonly airportRepository: Repository<AirportEntity>,
  ) {}

  async findAll(): Promise<AirportEntity[]> {
    return await this.airportRepository.find({ relations: ['airlines'] });
  }

  async findOne(id: string): Promise<AirportEntity> {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
      relations: ['airlines'],
    });

    if (!airport) {
      throw new BusinessLogicException(
        `The airport with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    return airport;
  }

  async create(airport: AirportEntity): Promise<AirportEntity> {
    if (airport.code.length !== 3) {
      throw new BusinessLogicException(
        `Airport code must be 3 characters long.`,
        BusinessError.BAD_REQUEST,
      );
    }
    return await this.airportRepository.save(airport);
  }

  async update(id: string, airport: AirportEntity): Promise<AirportEntity> {
    const persistedAirport: AirportEntity =
      await this.airportRepository.findOne({ where: { id } });

    if (airport.code.length !== 3) {
      throw new BusinessLogicException(
        `Airport code must be 3 characters long.`,
        BusinessError.BAD_REQUEST,
      );
    }

    if (!persistedAirport) {
      throw new BusinessLogicException(
        `The airport with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    return await this.airportRepository.save({
      ...persistedAirport,
      ...airport,
    });
  }

  async delete(id: string) {
    const airport: AirportEntity = await this.airportRepository.findOne({
      where: { id },
    });

    if (!airport) {
      throw new BusinessLogicException(
        `The airport with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.airportRepository.remove(airport);
  }
}
