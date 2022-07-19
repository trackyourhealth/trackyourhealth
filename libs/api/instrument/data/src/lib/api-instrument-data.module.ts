import { Module } from '@nestjs/common';

import { ApiInstrumentDataService } from './api-instrument-data.service';

@Module({
  controllers: [],
  providers: [ApiInstrumentDataService],
  exports: [ApiInstrumentDataService],
})
export class ApiInstrumentDataModule {}
