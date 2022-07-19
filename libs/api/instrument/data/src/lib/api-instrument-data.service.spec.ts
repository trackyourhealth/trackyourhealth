import { Test } from '@nestjs/testing';

import { ApiInstrumentDataService } from './api-instrument-data.service';

describe('ApiInstrumentDataService', () => {
  let service: ApiInstrumentDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiInstrumentDataService],
    }).compile();

    service = module.get(ApiInstrumentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
