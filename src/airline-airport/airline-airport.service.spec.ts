import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AirportEntity } from '../airport/airport.entity';
import { AirlineAirportServices } from './airline-airport.service';
import { AirlineEntity } from '../airline/airline.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { AirlineAirportModule } from './airline-airport.module';

describe('AirlineAirportServices', () => {
  let service: AirlineAirportServices;
  let airportsRepository: Repository<AirportEntity>;
  let airlinesRepository: Repository<AirlineEntity>;
  let airportsList: AirportEntity[];
  let storedAirline: AirlineEntity;

  const seedDatabase = async () => {
    airportsRepository.clear();
    airlinesRepository.clear();
    airportsList = [];

    for (let i = 0; i < 5; i++) {
      const city: string = faker.address.city();
      const airport: AirportEntity = await airportsRepository.save({
        name: `airport de ${city}`,
        code: city.slice(0, 3).toUpperCase(),
        country: faker.address.country(),
        city: city,
        airlines: [],
      });

      airportsList.push(airport);
    }

    storedAirline = await airlinesRepository.save({
      name: faker.address.country(),
      description: faker.lorem.paragraph(),
      dateFounding: faker.date.past(),
      webPage: faker.internet.domainName(),
      airports: [],
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), AirlineAirportModule],
      providers: [AirlineAirportServices],
    }).compile();

    service = module.get<AirlineAirportServices>(
      AirlineAirportServices,
    );

    airportsRepository = module.get<Repository<AirportEntity>>(
      getRepositoryToken(AirportEntity),
    );

    airlinesRepository = module.get<Repository<AirlineEntity>>(
      getRepositoryToken(AirlineEntity),
    );

    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('addAirportToAirline should create association', async () => {
  //   const airport = airportsList[0];

  //   const airline = await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   expect(airline.airports[0].name).toBe(airport.name);
  //   expect(airline.airports[0].id).toBe(airport.id);
  // });

  // it('addAirportToAirline should fail because airline not found', async () => {
  //   const airlineId = faker.datatype.uuid();
  //   const airport = airportsList[0];

  //   await expect(() =>
  //     service.addAirportToAirline(airlineId, airport.id),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineId} has not been found`,
  //   );
  // });

  // it('addAirportToAirline should fail because airport not found', async () => {
  //   const airportId = faker.datatype.uuid();

  //   await expect(() =>
  //     service.addAirportToAirline(storedAirline.id, airportId),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airportId} has not been found`,
  //   );
  // });

  // it('addAirportToAirline should fail because airline not found', async () => {
  //   const airlineId = faker.datatype.uuid();
  //   const airport = airportsList[0];

  //   await expect(() =>
  //     service.addAirportToAirline(airlineId, airport.id),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineId} has not been found`,
  //   );
  // });

  // it('findAirportsFromAirline should return a list of airports', async () => {
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(storedAirline.id, airport.id);

  //   const airports = await service.findAirportsFromAirline(storedAirline.id);

  //   expect(airports.length).toBe(1);

  //   expect(airports[0].name).toBe(airport.name);
  //   expect(airports[0].id).toBe(airport.id);
  // });

  // it('findAirportsFromAirline should fail because airline not found', async () => {
  //   const airlineId = faker.datatype.uuid();
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   await expect(() =>
  //     service.findAirportsFromAirline(airlineId),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineId} has not been found`,
  //   );
  // });


  // it('findAirportFromAirline should return an airport', async () => {
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   const persistedAirport = await service.findAirportFromAirline(storedAirline.id, airport.id);

  //   expect(persistedAirport.name).toBe(airport.name);
  //   expect(persistedAirport.id).toBe(airport.id);
  // });


  // it('findAirportFromAirline should fail for airline not found', async () => {
  //   const airlineId = faker.datatype.uuid();
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   await expect(() =>
  //     service.findAirportFromAirline(
  //       airlineId,
  //       airport.id,
  //     ),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineId} has not been found`,
  //   );
  // });

  // it('findAirportFromAirline should fail for airport not found', async () => {
  //   const airportId = faker.datatype.uuid();

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airportId,
  //   );

  //   await expect(() =>
  //     service.findAirportFromAirline(
  //       storedAirline.id,
  //       airportId,
  //     ),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airportId} has not been found`,
  //   );
  // });

  // it('findAirportFromAirline should fail because association not found', async () => {
  //   const airportId = airportsList[1].id;
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   await expect(() =>
  //     service.findAirportFromAirline(
  //       storedAirline.id,
  //       airportId,
  //     ),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airportId} is not associated with the airline with id ${storedAirline.id}`,
  //   );
  // });

  // it('updateAirportsFromAirline should update airline', async () => {
  //   const airline =
  //     await service.updateAirportsFromAirline(
  //       storedAirline.id,
  //       airportsList,
  //     );

  //   expect(airline.airports[0].name).toBe(
  //     airportsList[0].name,
  //   );
  //   expect(airline.airports[1].name).toBe(
  //     airportsList[1].name,
  //   );
  //   expect(airline.airports[2].name).toBe(
  //     airportsList[2].name,
  //   );
  // });

  // it('updateAirportsFromAirline fails becuase airline not found', async () => {
  //   const airlineId = faker.datatype.uuid();

  //   await expect(() =>
  //     service.updateAirportsFromAirline(
  //       airlineId,
  //       airportsList,
  //     ),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineId} has not been found`,
  //   );
  // });

  // it('updateAirportsFromAirline fails becuase airport not found', async () => {
    
  //   const city: string = faker.address.city();

  //   const airport = {
  //     id: faker.datatype.uuid(),
  //     name: `Airport of ${city}`,
  //     code: city.slice(0, 3).toUpperCase(),
  //     country: faker.address.country(),
  //     city: city,
  //     airlines: [],
  //   }

  //   await expect(() =>
  //     service.updateAirportsFromAirline(storedAirline.id, [
  //       ...airportsList,
  //       airport,
  //     ]),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airport.id} has not been found`,
  //   );
  // });

  // it('deleteAirportFromAirline should delete an aiport from airline', async () => {
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   const airline = await service.deleteAirportFromAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   expect(airline.airports.length).toBe(0);
  // });

  // it('deleteAirportFromAirline should fail because airline not found', async () => {
  //   const airport = airportsList[0];
  //   const airlineID = faker.datatype.uuid();

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   expect(() =>
  //     service.deleteAirportFromAirline(
  //       airlineID,
  //       airport.id,
  //     ),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airline with id ${airlineID} has not been found`,
  //   );
  // });

  // it('deleteAirportFromAirline should fail because airport not found', async () => {
  //   const airport = airportsList[0];
  //   const airportId = faker.datatype.uuid();

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   expect(() =>
  //     service.deleteAirportFromAirline(storedAirline.id, airportId),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airportId} has not been found`,
  //   );
  // });

  // it('deleteAirportFromAirline should fail because association not found', async () => {
  //   const airport = airportsList[0];

  //   await service.addAirportToAirline(
  //     storedAirline.id,
  //     airport.id,
  //   );

  //   expect(() =>
  //     service.deleteAirportFromAirline(storedAirline.id, airport.id),
  //   ).rejects.toHaveProperty(
  //     'message',
  //     `The airport with id ${airport.id} is not associated with airline with id ${storedAirline.id}`,
  //   );
  // });
});
