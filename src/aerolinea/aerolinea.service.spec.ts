import { Test, TestingModule } from '@nestjs/testing';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AerolineaEntity } from './aerolinea.entity';
import { AerolineaService } from './aerolinea.service';
import { AerolineaModule } from './aerolinea.module';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('AerolineaService', () => {
  let service: AerolineaService;
  let repository: Repository<AerolineaEntity>;
  let aerolineasList: AerolineaEntity[];

  const seedDatabase = async () => {
    repository.clear();
    aerolineasList = [];

    for (let i = 0; i <= 10; i++) {
      const aerolinea: AerolineaEntity = await repository.save({
        nombre: faker.address.country(),
        descripcion: faker.lorem.paragraph(),
        fechaDeFundacion: faker.date.past(),
        paginaWeb: faker.internet.domainName(),
        aeropuertos: [],
      });

      aerolineasList.push(aerolinea);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), AerolineaModule],
      providers: [AerolineaService],
    }).compile();

    service = module.get<AerolineaService>(AerolineaService);
    repository = module.get<Repository<AerolineaEntity>>(
      getRepositoryToken(AerolineaEntity),
    );

    await seedDatabase();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all aerolineas', async () => {
    const aerolineas: AerolineaEntity[] = await service.findAll();
    expect(aerolineas).not.toBeNull();
    expect(aerolineas).toHaveLength(aerolineasList.length);
  });

  it('findOne should return an aerolinea by id', async () => {
    const storedAerolinea: AerolineaEntity = aerolineasList[0];
    const aerolinea: AerolineaEntity = await service.findOne(
      storedAerolinea.id,
    );

    expect(aerolinea).not.toBeNull();
    expect(aerolinea.nombre).toEqual(storedAerolinea.nombre);
    expect(aerolinea.descripcion).toEqual(storedAerolinea.descripcion);
    expect(aerolinea.fechaDeFundacion).toEqual(
      storedAerolinea.fechaDeFundacion,
    );
    expect(aerolinea.paginaWeb).toEqual(storedAerolinea.paginaWeb);
  });

  it('findOne should throw an exception for an invalid aerolinea', async () => {
    const id: string = '0';
    await expect(() => service.findOne(id)).rejects.toHaveProperty(
      'message',
      `La aerolinea con id ${id} no se ha encontrado`,
    );
  });

  it('create should return a new aerolinea', async () => {
    const aerolinea: AerolineaEntity = {
      id: faker.datatype.uuid(),
      nombre: faker.animal.cat(),
      descripcion: faker.lorem.paragraph(),
      fechaDeFundacion: faker.date.past(),
      paginaWeb: faker.internet.domainName(),
      aeropuertos: [],
    };

    const newAerolinea: AerolineaEntity = await service.create(aerolinea);
    expect(newAerolinea).not.toBeNull();

    const storedAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: newAerolinea.id },
    });
    expect(storedAerolinea).not.toBeNull();
    expect(storedAerolinea.nombre).toEqual(newAerolinea.nombre);
    expect(storedAerolinea.descripcion).toEqual(newAerolinea.descripcion);
    expect(storedAerolinea.fechaDeFundacion).toEqual(
      newAerolinea.fechaDeFundacion,
    );
    expect(storedAerolinea.paginaWeb).toEqual(newAerolinea.paginaWeb);
  });

  it('update should modify an aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea.nombre = faker.animal.cat();
    aerolinea.descripcion = faker.lorem.paragraph();

    const updatedAerolinea: AerolineaEntity = await service.update(
      aerolinea.id,
      aerolinea,
    );
    expect(updatedAerolinea).not.toBeNull();

    const storedaAerolinea: AerolineaEntity = await repository.findOne({
      where: { id: aerolinea.id },
    });
    expect(storedaAerolinea).not.toBeNull();
    expect(storedaAerolinea.nombre).toEqual(aerolinea.nombre);
    expect(storedaAerolinea.descripcion).toEqual(aerolinea.descripcion);
  });

  it('update should throw an exception for an invalid aerolinea', async () => {
    const id: string = "0"
    let aerolinea: AerolineaEntity = aerolineasList[0];
    aerolinea = {
      ...aerolinea, nombre: faker.animal.cat(), descripcion: faker.lorem.paragraph()
    }

    await expect(() => service.update(id, aerolinea)).rejects.toHaveProperty("message", `La aerolinea con id ${id} no se ha encontrado`)
  });

  it('delete should remove an aerolinea', async () => {
    const aerolinea: AerolineaEntity = aerolineasList[0];
    
    await service.delete(aerolinea.id);

    const deletedAerolinea: AerolineaEntity = await repository.findOne({ where: { id: aerolinea.id } })
    
    expect(deletedAerolinea).toBeNull();
  });
});
