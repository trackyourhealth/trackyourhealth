import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';
import {
  ApiStudyDataService,
  StudyCrudService,
} from '@trackyourhealth/api/study/data';
import { prismaStudyMock } from '@trackyourhealth/api/testing/util';

import { ApiStudyFeatureController } from './api-study-feature.controller';

const mockCreate = jest.fn();
const mockDelete = jest.fn();
const mockUpdate = jest.fn();

describe('ApiStudyFeatureController', () => {
  let controller: ApiStudyFeatureController;

  beforeEach(async () => {
    prismaStudyMock.service.study.create = mockCreate;
    prismaStudyMock.service.study.delete = mockDelete;
    prismaStudyMock.service.study.update = mockUpdate;
    mockCreate.mockClear();
    mockDelete.mockClear();
    mockUpdate.mockClear();

    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, StudyCrudService, PrismaService],
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

  describe('getAllStudies', () => {
    it('returns all active studies', async () => {
      expect.assertions(1);
      const result = await controller.getAllStudies({} as ParsedQueryModel);
      expect(result).toStrictEqual(prismaStudyMock.getActiveStudies());
    });
  });

  describe('getById', () => {
    it('returns entity with valid id', async () => {
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

  describe('createStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = prismaStudyMock.getFirstStudy();
      mockCreate.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const input: Prisma.StudyCreateInput = {
        name: 'a study',
      };
      const result = await controller.createStudy(input);
      expect(result).toStrictEqual(expectedStudy);
      expect(mockCreate).toBeCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({ data: input });
    });

    it('throws HttpException on invalid studyId', async () => {
      mockCreate.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const input: Prisma.StudyCreateInput = {
        name: 'invalid id',
      };
      await controller.createStudy(input).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(mockCreate).toBeCalledTimes(1);
      expect(mockCreate).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('deleteStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = prismaStudyMock.getFirstStudy();
      mockDelete.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const studyId = expectedStudy.id;
      const result = await controller.deleteStudy(studyId);
      expect(result).toStrictEqual(expectedStudy);
      expect(mockDelete).toBeCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: studyId } });
    });

    it('throws HttpException on invalid studyId', async () => {
      mockDelete.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const studyId = 'invalid id';
      await controller.deleteStudy(studyId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(mockDelete).toBeCalledTimes(1);
      expect(mockDelete).toHaveBeenCalledWith({ where: { id: studyId } });
    });
  });

  describe('updateStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = prismaStudyMock.getFirstStudy();
      mockUpdate.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const studyId = expectedStudy.id;
      const input: Prisma.StudyUpdateInput = {
        name: 'new name',
      };
      const result = await controller.updateStudy(studyId, input);
      expect(result).toStrictEqual(expectedStudy);
      expect(mockUpdate).toBeCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        data: input,
        where: { id: studyId },
      });
    });

    it('throws HttpException on invalid studyId', async () => {
      mockUpdate.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const studyId = 'invalid id';
      const input: Prisma.StudyUpdateInput = {
        name: 'unused name',
      };
      await controller.updateStudy(studyId, input).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(mockUpdate).toBeCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({
        data: input,
        where: { id: studyId },
      });
    });
  });
});
