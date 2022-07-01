import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ApiStudyDataService } from '@trackyourhealth/api/study/data';
import { prismaStudyMock } from '@trackyourhealth/api/testing/util';

import { ApiStudyFeatureController } from './api-study-feature.controller';

describe('ApiStudyFeatureController', () => {
  let controller: ApiStudyFeatureController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, PrismaService],
      controllers: [ApiStudyFeatureController],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaStudyMock.service)
      .compile();

    controller = module.get(ApiStudyFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('getAllActiveStudies', () => {
    it('returns all active studies', async () => {
      expect.assertions(1);
      const result = await controller.getAllStudies();
      expect(result).toStrictEqual(prismaStudyMock.getActiveStudies());
    });
  });

  describe('getStudyById', () => {
    it('returns study on valid studyId', async () => {
      expect.assertions(1);
      const expectedStudy = prismaStudyMock.getFirstStudy();
      return controller
        .getStudyById(expectedStudy.id)
        .then((study) => expect(study).toStrictEqual(expectedStudy));
    });

    it('throws HttpException on invalid studyId', async () => {
      expect.assertions(1);
      const invalidStudyId = 'invalid and not used studyId';
      return controller
        .getStudyById(invalidStudyId)
        .catch((e) => expect(e.name).toStrictEqual('HttpException'));
    });
  });
});
