import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { ApiStudyDataService } from './api-study-data.service';

describe('ApiStudyDataService', () => {
  let service: ApiStudyDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, PrismaService],
    }).compile();
    service = module.get(ApiStudyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
