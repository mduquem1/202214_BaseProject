import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class AirlineDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;


  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  readonly dateFounding: Date;

  @IsUrl()
  @IsNotEmpty()
  readonly webPage: string;
}
