import { TypeOrmModule } from "@nestjs/typeorm";
import { AerolineaEntity } from "../../aerolinea/aerolinea.entity";
import { AeropuertoEntity } from "../../aeropuerto/aeropuerto.entity";

export const TypeOrmTestingConfig = () => [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [AerolineaEntity, AeropuertoEntity],
        dropSchema: true,
        synchronize: true,
        keepConnectionAlive: true,
      }),
      TypeOrmModule.forFeature([AerolineaEntity, AeropuertoEntity])
]