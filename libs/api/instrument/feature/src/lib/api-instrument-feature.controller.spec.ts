import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { ApiInstrumentDataModule } from '@trackyourhealth/api/instrument/data';

import { ApiInstrumentFeatureController } from './api-instrument-feature.controller';
import { ApiInstrumentFeatureModule } from './api-instrument-feature.module';

describe('ApiInstrumentFeatureController', () => {
  let controller: ApiInstrumentFeatureController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ApiInstrumentFeatureModule,
        ApiInstrumentDataModule,
        ThrottlerModule.forRoot(),
      ],
    }).compile();

    controller = module.get(ApiInstrumentFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
