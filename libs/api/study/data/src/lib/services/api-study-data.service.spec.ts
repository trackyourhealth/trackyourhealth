import { Test } from '@nestjs/testing';
import { Prisma, Study } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';

import { ApiStudyDataService } from './api-study-data.service';

const studies: Study[] = [
  {
    id: '1234',
    name: 'teststudy1234',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: true,
    startsAt: new Date(),
    endsAt: new Date(),
  },
  {
    id: '4321',
    name: 'teststudy4321',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'teststudy',
    description: 'study for testing',
    isActive: false,
    startsAt: new Date(),
    endsAt: new Date(),
  },
];

const mockFindManyStudies = async (
  options?: Prisma.StudyFindManyArgs,
): Promise<Study[]> => {
  const whereOpts = options?.where;
  if (whereOpts) {
    if (typeof whereOpts.isActive === 'boolean') {
      return studies.filter((study) => study.isActive === whereOpts.isActive);
    }
  }
  return studies;
};

const mockStudyPrisma = {
  study: {
    findMany: mockFindManyStudies,
  },
};

describe('ApiStudyDataService', () => {
  let service: ApiStudyDataService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockStudyPrisma)
      .compile();
    service = module.get(ApiStudyDataService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllActiveStudies', () => {
    it('returns active studies', async () => {
      const result = await service.getAllActiveStudies();
      expect(result).toStrictEqual([studies[0]]);
    });
  });
});
