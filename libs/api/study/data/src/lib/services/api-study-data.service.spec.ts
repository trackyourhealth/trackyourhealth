import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { prismaStudyMock } from '../../../../mocks';
import { ApiStudyDataService } from './api-study-data.service';

describe('ApiStudyDataService', () => {
  let service: ApiStudyDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaStudyMock.service)
      .compile();
    service = module.get(ApiStudyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllActiveStudies', () => {
    it('returns active studies', async () => {
      expect.assertions(1);
      const result = await service.getAllActiveStudies();
      expect(result).toStrictEqual(prismaStudyMock.getActiveStudies());
    });
  });

  describe('getStudyById', () => {
    it('returns study on valid studyId', async () => {
      expect.assertions(1);
      const expectedStudy = prismaStudyMock.getFirstStudy();
      const result = await service.getStudyById(expectedStudy.id);
      expect(result).toStrictEqual(expectedStudy);
    });

    it('returns null on invalid studyId', async () => {
      expect.assertions(1);
      const invalidStudyId = 'invalid and not used studyId';
      const result = await service.getStudyById(invalidStudyId);
      expect(result).toBeNull();
    });

    it('returns null on empty studyId', async () => {
      expect.assertions(1);
      const result = await service.getStudyById('');
      expect(result).toBeNull();
    });
  });
});
