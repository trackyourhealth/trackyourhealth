import { Module } from '@nestjs/common';

import { ApiInstrumentFeatureController } from './api-instrument-feature.controller';

@Module({
  controllers: [ApiInstrumentFeatureController],
  providers: [],
  exports: [],
})
export class ApiInstrumentFeatureModule {}
