import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AirlineEntity } from './airline.entity';
import { AirlineService } from './airline.service';
import { AirlineModule } from './airline.module';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AirlineService', () => {
  let service: AirlineService;
  let repository: Repository<AirlineEntity>;
  let airlinesList: AirlineEntity[];

  const seedDatabase = async () => {
    repository.clear();
    airlinesList = [];

    for (let i = 0; i <= 10; i++) {
      const airline: AirlineEntity = await repository.save({
        name: faker.address.country(),
        description: faker.lorem.paragraph(),
        dateFounding: faker.date.past(),
        webPage: faker.internet.domainName(),
        airports: [],
      });

      airlinesList.push(airline);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), AirlineModule],
      providers: [AirlineService],
    }).compile();

    service = module.get<AirlineService>(AirlineService);
    repository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all airlines', async () => {
    const airlines: AirlineEntity[] = await service.findAll();
    expect(airlines).not.toBeNull();
    expect(airlines).toHaveLength(airlinesList.length);
  });

  it('findOne should return an airline by id', async () => {
    const storedairline: AirlineEntity = airlinesList[0];
    const airline: AirlineEntity = await service.findOne(storedairline.id);

    expect(airline).not.toBeNull();
    expect(airline.name).toEqual(storedairline.name);
    expect(airline.description).toEqual(storedairline.description);
    expect(airline.dateFounding).toEqual(storedairline.dateFounding);
    expect(airline.webPage).toEqual(storedairline.webPage);
  });

  it('findOne should throw an exception for an invalid airline', async () => {
    const id: string = '0';
    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `The airline with id ${id} has not been found`,
    );
  });

  it('create should return a new airline', async () => {
    const airline: AirlineEntity = {
      id: faker.datatype.uuid(),
      name: faker.animal.cat(),
      description: faker.lorem.paragraph(),
      dateFounding: faker.date.past(),
      webPage: faker.internet.domainName(),
      airports: [],
    };

    const newAirline: AirlineEntity = await service.create(airline);
    expect(newAirline).not.toBeNull();

    const storedairline: AirlineEntity = await repository.findOne({
      where: { id: newAirline.id },
    });
    expect(storedairline).not.toBeNull();
    expect(storedairline.name).toEqual(newAirline.name);
    expect(storedairline.description).toEqual(newAirline.description);
    expect(storedairline.dateFounding).toEqual(newAirline.dateFounding);
    expect(storedairline.webPage).toEqual(newAirline.webPage);
  });

  it('create should return an error for invalid date', async () => {
    const airline: AirlineEntity = {
      id: faker.datatype.uuid(),
      name: faker.animal.cat(),
      description: faker.lorem.paragraph(),
      dateFounding: faker.date.future(),
      webPage: faker.internet.domainName(),
      airports: [],
    };

    await expect(() => service.create(airline)).rejects.toHaveProperty(
      'message',
      `Date of founding should be in the past.`,
    );
  });

  it('update should modify an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];
    airline.name = faker.animal.cat();
    airline.description = faker.lorem.paragraph();

    const updatedairline: AirlineEntity = await service.update(
      airline.id,
      airline,
    );
    expect(updatedairline).not.toBeNull();

    const storedaAirline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });
    expect(storedaAirline).not.toBeNull();
    expect(storedaAirline.name).toEqual(airline.name);
    expect(storedaAirline.description).toEqual(airline.description);
  });

  it('update should throw an exception for airline not found', async () => {
    const id: string = '0';
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      name: faker.animal.cat(),
      description: faker.lorem.paragraph(),
    };

    await expect(() => service.update(id, airline)).rejects.toHaveProperty(
      'message',
      `The airline with id ${id} has not been found`,
    );
  });


  it('update should return an error for invalid date', async () => {
    let airline: AirlineEntity = airlinesList[0];
    airline = {
      ...airline,
      name: faker.animal.cat(),
      description: faker.lorem.paragraph(),
      dateFounding: faker.date.future()
    };


    await expect(() => service.update(airline.id, airline)).rejects.toHaveProperty(
      'message',
      `Date of founding should be in the past.`,
    );
  });

  it('delete should remove an airline', async () => {
    const airline: AirlineEntity = airlinesList[0];

    await service.delete(airline.id);

    const deletedairline: AirlineEntity = await repository.findOne({
      where: { id: airline.id },
    });

    expect(deletedairline).toBeNull();
  });
});
