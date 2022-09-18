import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { AirlineEntity } from './airline.entity';

@Injectable()
export class AirlineService {
  constructor(
    @InjectRepository(AirlineEntity)
    private readonly airlineRepository: Repository<AirlineEntity>,
  ) {}

  async findAll(): Promise<AirlineEntity[]> {
    return await this.airlineRepository.find({ relations: ['airports'] });
  }

  async findOne(id: string): Promise<AirlineEntity> {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }
    return airline;
  }

  async create(airline: AirlineEntity): Promise<AirlineEntity> {
    if (new Date(airline.dateFounding) > new Date()) {
      throw new BusinessLogicException(
        `Date of founding should be in the past.`,
        BusinessError.BAD_REQUEST,
      );
    }

    return await this.airlineRepository.save(airline);
  }

  async update(id: string, airline: AirlineEntity): Promise<AirlineEntity> {
    const persistedAirline: AirlineEntity =
      await this.airlineRepository.findOne({ where: { id } });

    if (new Date(airline.dateFounding) > new Date()) {
      throw new BusinessLogicException(
        `Date of founding should be in the past.`,
        BusinessError.BAD_REQUEST,
      );
    }

    if (!persistedAirline) {
      throw new BusinessLogicException(
        `The airline with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    return await this.airlineRepository.save({
      ...persistedAirline,
      ...airline,
    });
  }

  async delete(id: string) {
    const airline: AirlineEntity = await this.airlineRepository.findOne({
      where: { id },
    });

    if (!airline) {
      throw new BusinessLogicException(
        `The airline with id ${id} has not been found`,
        BusinessError.NOT_FOUND,
      );
    }

    await this.airlineRepository.remove(airline);
  }
}
