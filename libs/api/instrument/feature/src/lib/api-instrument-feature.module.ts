import { Module } from '@nestjs/common';
import { ApiInstrumentDataModule } from '@trackyourhealth/api/instrument/data';

import { ApiInstrumentFeatureController } from './api-instrument-feature.controller';

@Module({
  imports: [ApiInstrumentDataModule],
  controllers: [ApiInstrumentFeatureController],
  providers: [],
  exports: [],
})
export class ApiInstrumentFeatureModule {}
