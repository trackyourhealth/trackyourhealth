import { Test } from '@nestjs/testing';

import { ApiStudiesService } from './api-studies.service';

describe('ApiStudiesService', () => {
  let service: ApiStudiesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudiesService],
    }).compile();

    service = module.get(ApiStudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
