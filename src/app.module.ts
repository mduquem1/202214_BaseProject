import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AirlineModule } from './airline/airline.module';
import { AirportModule } from './airport/airport.module';
import { AirlineEntity } from './airline/airline.entity';
import { AirportEntity } from './airport/airport.entity';
import { AirlineAirportModule } from './airline-airport/airline-airport.module';

@Module({
  imports: [AirlineModule, AirportModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      entities: [AirlineEntity, AirportEntity],
      database : 'airlines',
      autoLoadEntities: true,
      synchronize: true,
      keepConnectionAlive: true,
    }),
    AirlineAirportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
