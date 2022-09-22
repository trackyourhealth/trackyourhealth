import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import {
  ParsedQueryModel,
  ParsedQuerySortModel,
} from '@prisma-utils/nestjs-request-parser';
import {
  ApiStudyDataService,
  StudyCrudService,
} from '@trackyourhealth/api/study/data';
import {
  dbConnectionError,
  dbKnownError,
  studies,
  studyCrudMock,
} from '@trackyourhealth/api/testing/util';

import { CreateStudyRequest, UpdateStudyRequest } from '../data/requests';
import { ApiStudyFeatureController } from './api-study-feature.controller';

describe('ApiStudyFeatureController', () => {
  let controller: ApiStudyFeatureController;

  beforeEach(async () => {
    studyCrudMock.clearMocks();

    const module = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot()],
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
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(5);
      const result = await controller.getAllStudies({} as ParsedQueryModel);
      expect(result).toStrictEqual({
        items: studies,
        meta: {
          totalItems: studies.length,
          items: studies.length,
          totalPages: 1,
          page: 1,
        },
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });

    it('should map values of ParsedQueryModel', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(5);
      const take = studies.length;
      const page = 1;
      const skip = 0;
      const sort: ParsedQuerySortModel[] = [
        { id: 'desc' },
        { createdAt: 'asc' },
      ];
      const parser: ParsedQueryModel = {
        page: page,
        take: take,
        skip: skip,
        sort: sort,
      };
      const result = await controller.getAllStudies(parser);
      expect(result).toStrictEqual({
        items: studies,
        meta: {
          totalItems: studies.length,
          items: studies.length,
          totalPages: 1,
          page: 1,
        },
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        orderBy: sort,
        take: take,
        skip: skip,
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });

    it('throws InternalServerErrorException on error from database', async () => {
      studyCrudMock.findMany.mockRejectedValueOnce(dbConnectionError);
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(6);
      await controller.getAllStudies({} as ParsedQueryModel).catch((e) => {
        // TODO: update CrudService to throw InternalServerErrorException
        //expect(e.status).toStrictEqual(500);
        //expect(e.name).toStrictEqual('InternalServerErrorException');
        expect(e.name).toStrictEqual('Error');
        expect(e.message).toStrictEqual("Can't reach database server");
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });
  });

  describe('getById', () => {
    it('returns entity with valid id', async () => {
      const expectedStudy = studies[0];
      studyCrudMock.findUniqueOrThrow.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const result = await controller.getStudyById(expectedStudy.id);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: expectedStudy.id },
      });
    });

    it('throws NotFoundException on error from database', async () => {
      studyCrudMock.findUniqueOrThrow.mockRejectedValueOnce(dbConnectionError);
      expect.assertions(4);
      const ignoredId = 'ignored id';
      await controller.getStudyById(ignoredId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('NotFoundException');
      });
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: ignoredId },
      });
    });

    it('throws NotFoundException on invalid studyId', async () => {
      studyCrudMock.findUniqueOrThrow.mockRejectedValueOnce(dbKnownError);
      expect.assertions(4);
      const invalidStudyId = 'invalid and not used studyId';
      await controller.getStudyById(invalidStudyId).catch((e) => {
        expect(e.status).toStrictEqual(404);
        expect(e.name).toStrictEqual('NotFoundException');
      });
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: invalidStudyId },
      });
    });
  });

  describe('createStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = studies[0];
      studyCrudMock.create.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const input: CreateStudyRequest = {
        data: {
          title: {},
          description: {},
          name: 'a study',
          isActive: true,
          startsAt: new Date(),
        },
      };
      const result = await controller.createStudy(input);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toHaveBeenCalledWith(input);
    });

    it('throws HttpException on invalid studyId', async () => {
      studyCrudMock.create.mockRejectedValueOnce(dbKnownError);
      expect.assertions(4);
      const input: CreateStudyRequest = {
        data: {
          title: {},
          description: {},
          name: 'invalid id',
          isActive: true,
          startsAt: new Date(),
        },
      };
      await controller.createStudy(input).catch((e) => {
        expect(e.status).toStrictEqual(500);
        expect(e.name).toStrictEqual('InternalServerErrorException');
      });
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toHaveBeenCalledWith(input);
    });
  });

  describe('updateStudy', () => {
    it('returns valid study', async () => {
      const expectedStudy = studies[1];
      studyCrudMock.update.mockResolvedValueOnce(expectedStudy);
      expect.assertions(3);
      const studyId = expectedStudy.id;
      const input: UpdateStudyRequest = {
        data: { name: 'new name' },
      };
      const result = await controller.updateStudy(studyId, input);
      expect(result).toStrictEqual(expectedStudy);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toHaveBeenCalledWith({
        data: input.data,
        where: { id: studyId },
      });
    });

    it('throws InternalServerErrorException on invalid studyId', async () => {
      studyCrudMock.update.mockRejectedValueOnce(dbKnownError);
      expect.assertions(4);
      const studyId = 'invalid id';
      const input: UpdateStudyRequest = {
        data: { name: 'unused name' },
      };
      await controller.updateStudy(studyId, input).catch((e) => {
        expect(e.status).toStrictEqual(500);
        expect(e.name).toStrictEqual('InternalServerErrorException');
      });
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toHaveBeenCalledWith({
        data: input.data,
        where: { id: studyId },
      });
    });
  });

  describe('deleteStudy', () => {
    it('calls delete of db orrectly', async () => {
      const expectedStudy = studies[1];
      studyCrudMock.delete.mockResolvedValueOnce(expectedStudy);
      expect.assertions(2);
      const studyId = expectedStudy.id;
      await controller.deleteStudy(studyId);
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toHaveBeenCalledWith({
        where: { id: studyId },
      });
    });

    it('throws InternalServerErrorException on invalid studyId', async () => {
      studyCrudMock.delete.mockRejectedValueOnce(dbKnownError);
      expect.assertions(4);
      const studyId = 'invalid id';
      await controller.deleteStudy(studyId).catch((e) => {
        expect(e.status).toStrictEqual(500);
        expect(e.name).toStrictEqual('InternalServerErrorException');
      });
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toHaveBeenCalledWith({
        where: { id: studyId },
      });
    });
  });
});
