import { Test } from '@nestjs/testing';
import { PrismaModule } from '@prisma-utils/nestjs-prisma';

import { ApiStudiesService } from './api-studies.service';

describe('ApiStudiesService', () => {
  let service: ApiStudiesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      imports: [PrismaModule.forRoot({ isGlobal: true })],
      providers: [ApiStudiesService],
    }).compile();

    service = module.get(ApiStudiesService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
