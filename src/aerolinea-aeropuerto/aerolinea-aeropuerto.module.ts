import { Module } from '@nestjs/common';
import { AerolineaAeropuertoService } from './aerolinea-aeropuerto.service';

@Module({
  providers: [AerolineaAeropuertoService]
})
export class AerolineaAeropuertoModule {}
