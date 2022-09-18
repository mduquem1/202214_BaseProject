import { AirlineEntity } from '../airline/airline.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MaxLength, MinLength } from 'class-validator';

@Entity()
export class AirportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @MaxLength(3)
  @MinLength(3)
  code: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @ManyToMany(() => AirlineEntity, (airline) => airline.airports)
  airlines: AirlineEntity[];
}
