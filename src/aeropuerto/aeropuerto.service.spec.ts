import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AeropuertoEntity } from './aeropuerto.entity';
import { AeropuertoService } from './aeropuerto.service';
import { AeropuertoModule } from './aeropuerto.module';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AeropuertoService', () => {
  let service: AeropuertoService;
  let repository: Repository<AeropuertoEntity>;
  let aeropuertosList: AeropuertoEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aeropuertosList = [];

    for (let i = 0; i <= 10; i++) {
      const city: string = faker.address.city()
      const aeropuerto: AeropuertoEntity = await repository.save({
        nombre: `Aeropuerto de ${city}`,
        codigo_iata: city.slice(0, 3).toUpperCase(),
        pais: faker.address.country(),
        ciudad: city,
        aerolineas: [],
      });

      aeropuertosList.push(aeropuerto);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), AeropuertoModule],
      providers: [AeropuertoService],
    }).compile();

    service = module.get<AeropuertoService>(AeropuertoService);
    repository = module.get<Repository<AeropuertoEntity>>(
      getRepositoryToken(AeropuertoEntity),
    );

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aeropuertos', async () => {
    const aeropuertos: AeropuertoEntity[] = await service.findAll();
    expect(aeropuertos).not.toBeNull();
    expect(aeropuertos).toHaveLength(aeropuertosList.length);
  });

  it('findOne should return an aeropuerto by id', async () => {
    const storedaeropuerto: AeropuertoEntity = aeropuertosList[0];
    const aeropuerto: AeropuertoEntity = await service.findOne(
      storedaeropuerto.id,
    );

    expect(aeropuerto).not.toBeNull();
    expect(aeropuerto.nombre).toEqual(storedaeropuerto.nombre);
    expect(aeropuerto.codigo_iata).toEqual(storedaeropuerto.codigo_iata);
    expect(aeropuerto.pais).toEqual(
      storedaeropuerto.pais,
    );
    expect(aeropuerto.ciudad).toEqual(storedaeropuerto.ciudad);
  });

  it('findOne should throw an exception for an invalid aeropuerto', async () => {
    const id: string = '0';
    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `El aeropuerto con id ${id} no se ha encontrado`,
    );
  });

  it('create should return a new aeropuerto', async () => {
    const city: string = faker.address.city()
    const aeropuerto: AeropuertoEntity = {
      id: faker.datatype.uuid(),
      nombre: `Aeropuerto de ${city}`,
        codigo_iata: city.slice(0, 3).toUpperCase(),
        pais: faker.address.country(),
        ciudad: city,
        aerolineas: [],
    };

    const newaeropuerto: AeropuertoEntity = await service.create(aeropuerto);
    expect(newaeropuerto).not.toBeNull();

    const storedaeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: newaeropuerto.id },
    });
    expect(storedaeropuerto).not.toBeNull();
    expect(storedaeropuerto.nombre).toEqual(newaeropuerto.nombre);
    expect(storedaeropuerto.codigo_iata).toEqual(newaeropuerto.codigo_iata);
    expect(storedaeropuerto.pais).toEqual(
      newaeropuerto.pais,
    );
    expect(storedaeropuerto.ciudad).toEqual(newaeropuerto.ciudad);
  });

  it('update should modify an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto.nombre = faker.address.city();
    aeropuerto.pais = faker.address.country();

    const updatedaeropuerto: AeropuertoEntity = await service.update(
      aeropuerto.id,
      aeropuerto,
    );
    expect(updatedaeropuerto).not.toBeNull();

    const storedaaeropuerto: AeropuertoEntity = await repository.findOne({
      where: { id: aeropuerto.id },
    });
    expect(storedaaeropuerto).not.toBeNull();
    expect(storedaaeropuerto.nombre).toEqual(aeropuerto.nombre);
    expect(storedaaeropuerto.pais).toEqual(aeropuerto.pais);
  });

  it('update should throw an exception for an invalid aeropuerto', async () => {
    const id: string = "0"
    let aeropuerto: AeropuertoEntity = aeropuertosList[0];
    aeropuerto = {
      ...aeropuerto, nombre: faker.address.city(), pais: faker.address.country()
    }

    await expect(() => service.update(id, aeropuerto)).rejects.toHaveProperty("message", `El aeropuerto con id ${id} no se ha encontrado`)
  });

  it('delete should remove an aeropuerto', async () => {
    const aeropuerto: AeropuertoEntity = aeropuertosList[0];
    
    await service.delete(aeropuerto.id);

    const deletedaeropuerto: AeropuertoEntity = await repository.findOne({ where: { id: aeropuerto.id } })
    
    expect(deletedaeropuerto).toBeNull();
  });
});
