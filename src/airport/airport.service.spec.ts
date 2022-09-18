import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AirportEntity } from './airport.entity';
import { AirportService } from './airport.service';
import { AirportModule } from './airport.module';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirportService', () => {
  let service: AirportService;
  let repository: Repository<AirportEntity>;
  let airportsList: AirportEntity[];

  const seedDatabase = async () => {
    repository.clear();
    airportsList = [];

    for (let i = 0; i <= 10; i++) {
      const city: string = faker.address.city()
      const airport: AirportEntity = await repository.save({
        name: `airport de ${city}`,
        code: city.slice(0, 3).toUpperCase(),
        country: faker.address.country(),
        city: city,
        airlines: [],
      });

      airportsList.push(airport);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), AirportModule],
      providers: [AirportService],
    }).compile();

    service = module.get<AirportService>(AirportService);
    repository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airports', async () => {
    const airports: AirportEntity[] = await service.findAll();
    expect(airports).not.toBeNull();
    expect(airports).toHaveLength(airportsList.length);
  });

  it('findOne should return an airport by id', async () => {
    const storedAirport: AirportEntity = airportsList[0];
    const airport: AirportEntity = await service.findOne(
      storedAirport.id,
    );

    expect(airport).not.toBeNull();
    expect(airport.name).toEqual(storedAirport.name);
    expect(airport.code).toEqual(storedAirport.code);
    expect(airport.country).toEqual(
      storedAirport.country,
    );
    expect(airport.city).toEqual(storedAirport.city);
  });

  it('findOne should throw an exception for airport not found', async () => {
    const id: string = '0';
    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `The airport with id ${id} has not been found`,
    );
  });

  it('create should return a new airport', async () => {
    const city: string = faker.address.city()
    const airport: AirportEntity = {
      id: faker.datatype.uuid(),
      name: `airport de ${city}`,
        code: city.slice(0, 3).toUpperCase(),
        country: faker.address.country(),
        city: city,
        airlines: [],
    };

    const newAirport: AirportEntity = await service.create(airport);
    expect(newAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: newAirport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(newAirport.name);
    expect(storedAirport.code).toEqual(newAirport.code);
    expect(storedAirport.country).toEqual(
      newAirport.country,
    );
    expect(storedAirport.city).toEqual(newAirport.city);
  });

  it('create should return an error for invalid airport', async () => {
    const city: string = faker.address.city()
    const airport: AirportEntity = {
      id: faker.datatype.uuid(),
      name: `airport de ${city}`,
        code: city.slice(0, 2).toUpperCase(),
        country: faker.address.country(),
        city: city,
        airlines: [],
    };

    await expect(() => service.create(airport)).rejects.toHaveProperty(
      'message',
      `Airport code must be 3 characters long.`,
    );
  });

  it('update should modify an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = faker.address.city();
    airport.country = faker.address.country();

    const updatedAirport: AirportEntity = await service.update(
      airport.id,
      airport,
    );
    expect(updatedAirport).not.toBeNull();

    const storedAirport: AirportEntity = await repository.findOne({
      where: { id: airport.id },
    });
    expect(storedAirport).not.toBeNull();
    expect(storedAirport.name).toEqual(airport.name);
    expect(storedAirport.country).toEqual(airport.country);
  });


  it('update should create an error for invalid airport', async () => {
    const airport: AirportEntity = airportsList[0];
    airport.name = faker.address.city();
    airport.code = airport.city.slice(0, 2).toUpperCase();

    await expect(() => service.update(airport.id, airport)).rejects.toHaveProperty(
      'message',
      `Airport code must be 3 characters long.`,
    );
  });

  it('update should throw an exception for an invalid airport', async () => {
    const id: string = "0"
    let airport: AirportEntity = airportsList[0];
    airport = {
      ...airport, name: faker.address.city(), country: faker.address.country()
    }

    await expect(() => service.update(id, airport)).rejects.toHaveProperty("message", `The airport with id ${id} has not been found`)
  });

  it('delete should remove an airport', async () => {
    const airport: AirportEntity = airportsList[0];
    
    await service.delete(airport.id);

    const deletedAirport: AirportEntity = await repository.findOne({ where: { id: airport.id } })
    
    expect(deletedAirport).toBeNull();
  });
});
