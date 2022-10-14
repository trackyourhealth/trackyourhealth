import { Test } from '@nestjs/testing';

import { ApiInstrumentDataModule } from '../api-instrument-data.module';
import { ApiInstrumentDataService } from './api-instrument-data.service';

describe('ApiInstrumentDataService', () => {
  let service: ApiInstrumentDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiInstrumentDataModule],
    }).compile();

    service = module.get(ApiInstrumentDataService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
