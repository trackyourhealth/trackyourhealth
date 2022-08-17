import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ParsedQueryModel } from '@prisma-utils/nestjs-request-parser';
import {
  ApiStudyDataService,
  StudyCrudService,
} from '@trackyourhealth/api/study/data';
import { studies, studyCrudMock } from '@trackyourhealth/api/testing/util';

import { ApiStudyFeatureController } from './api-study-feature.controller';

describe('ApiStudyFeatureController', () => {
  let controller: ApiStudyFeatureController;

  beforeEach(async () => {
    studyCrudMock.clearMocks();

    const module = await Test.createTestingModule({
      providers: [ApiStudyDataService, StudyCrudService, PrismaService],
      controllers: [ApiStudyFeatureController],
    })
      .overrideProvider(PrismaService)
      .useValue(studyCrudMock.service)
      .compile();

    controller = module.get(ApiStudyFeatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeTruthy();
  });

  describe('getAllStudies', () => {
    it('returns all active studies', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      expect.assertions(3);
      const result = await controller.getAllStudies({} as ParsedQueryModel);
      expect(result).toStrictEqual(studies);
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        where: { isActive: true },
      });
    });

    it('throws HttpException on error from database', async () => {
      studyCrudMock.findMany.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      await controller.getAllStudies({} as ParsedQueryModel).catch((e) => {
        expect(e.status).toStrictEqual(500);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        where: { isActive: true },
      });
    });
  });

  describe('getById', () => {
    it('returns entity with valid id', async () => {
      const expectedStudy = studies[0];
      studyCrudMock.findUnique.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const result = await controller.getStudyById(expectedStudy.id);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.findUnique).toBeCalledTimes(1);
      expect(studyCrudMock.findUnique).toBeCalledWith({
        where: { id: expectedStudy.id },
      });
    });

    it('throws HttpException on error from database', async () => {
      studyCrudMock.findUnique.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const ignoredId = 'ignored id';
      await controller.getStudyById(ignoredId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.findUnique).toBeCalledTimes(1);
      expect(studyCrudMock.findUnique).toBeCalledWith({
        where: { id: ignoredId },
      });
    });

    it('throws HttpException on invalid studyId', async () => {
      studyCrudMock.findUnique.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const invalidStudyId = 'invalid and not used studyId';
      await controller.getStudyById(invalidStudyId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.findUnique).toBeCalledTimes(1);
      expect(studyCrudMock.findUnique).toBeCalledWith({
        where: { id: invalidStudyId },
      });
    });
  });

  describe('createStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = studies[0];
      studyCrudMock.create.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const input: Prisma.StudyCreateInput = {
        name: 'a study',
      };
      const result = await controller.createStudy(input);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toHaveBeenCalledWith({ data: input });
    });

    it('throws HttpException on invalid studyId', async () => {
      studyCrudMock.create.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const input: Prisma.StudyCreateInput = {
        name: 'invalid id',
      };
      await controller.createStudy(input).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toHaveBeenCalledWith({ data: input });
    });
  });

  describe('deleteStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = studies[1];
      studyCrudMock.delete.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const studyId = expectedStudy.id;
      const result = await controller.deleteStudy(studyId);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toHaveBeenCalledWith({
        where: { id: studyId },
      });
    });

    it('throws HttpException on invalid studyId', async () => {
      studyCrudMock.delete.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const studyId = 'invalid id';
      await controller.deleteStudy(studyId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toHaveBeenCalledWith({
        where: { id: studyId },
      });
    });
  });

  describe('updateStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = studies[1];
      studyCrudMock.update.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const studyId = expectedStudy.id;
      const input: Prisma.StudyUpdateInput = {
        name: 'new name',
      };
      const result = await controller.updateStudy(studyId, input);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toHaveBeenCalledWith({
        data: input,
        where: { id: studyId },
      });
    });

    it('throws HttpException on invalid studyId', async () => {
      studyCrudMock.update.mockRejectedValueOnce(new Error());
      expect.assertions(4);
      const studyId = 'invalid id';
      const input: Prisma.StudyUpdateInput = {
        name: 'unused name',
      };
      await controller.updateStudy(studyId, input).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('HttpException');
      });
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toHaveBeenCalledWith({
        data: input,
        where: { id: studyId },
      });
    });
  });
});
