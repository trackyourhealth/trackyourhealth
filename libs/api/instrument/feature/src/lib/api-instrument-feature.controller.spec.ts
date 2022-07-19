import { Test } from '@nestjs/testing';

import { ApiInstrumentFeatureController } from './api-instrument-feature.controller';

describe('ApiInstrumentFeatureController', () => {
  let controller: ApiInstrumentFeatureController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [],
      controllers: [ApiInstrumentFeatureController],
    }).compile();

    controller = module.get(ApiInstrumentFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });
});
