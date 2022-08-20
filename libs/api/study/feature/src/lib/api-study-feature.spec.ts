import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { ApiStudyDataModule } from '@trackyourhealth/api/study/data';
import {
  dbConnectionError,
  dbKnownError,
  defaultQueryValues,
  getStudyDateStringified,
  studies,
  studyCrudMock,
} from '@trackyourhealth/api/testing/util';
import * as request from 'supertest';

import { ApiStudyFeatureModule } from './api-study-feature.module';

describe('ApiStudyFeature', () => {
  let app: INestApplication;
  const baseRoute = '/studies';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiStudyFeatureModule, ApiStudyDataModule],
    })
      .overrideProvider(PrismaService)
      .useValue(studyCrudMock.service)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    studyCrudMock.clearMocks();
  });

  describe('GET /studies', () => {
    it('returns all active studies', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      expect.assertions(4 + studies.length);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const actualStudies = response.body;
      expect(actualStudies.length).toStrictEqual(studies.length);
      for (let i = 0; i < studies.length; i++) {
        const expectedStudy = getStudyDateStringified(studies[i]);
        expect(actualStudies[i]).toStrictEqual(expectedStudy);
      }
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        ...defaultQueryValues,
        where: {
          isActive: true,
        },
      });
    });

    it('returns Internal Server Error on missing database connection', async () => {
      studyCrudMock.findMany.mockRejectedValueOnce(dbConnectionError);
      expect.assertions(3);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        ...defaultQueryValues,
        where: {
          isActive: true,
        },
      });
    });

    it('parses additional request parameters', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      expect.assertions(4 + studies.length);
      const limit = 17;
      const page = 4;
      const address = `${baseRoute}/?limit=${limit}&page=${page}&sort=-id,createdAt`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const actualStudies = response.body;
      expect(actualStudies.length).toStrictEqual(studies.length);
      for (let i = 0; i < studies.length; i++) {
        const expectedStudy = getStudyDateStringified(studies[i]);
        expect(actualStudies[i]).toStrictEqual(expectedStudy);
      }
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        orderBy: [{ id: 'desc' }, { createdAt: 'asc' }],
        take: limit,
        skip: limit * (page - 1),
        where: {
          isActive: true,
        },
      });
    });
  });

  describe('GET /studies/id', () => {
    it('returns study on valid id', async () => {
      const study = studies[1];
      studyCrudMock.findUnique.mockResolvedValueOnce(study);
      expect.assertions(4);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const expectedStudy = getStudyDateStringified(study);
      const actualStudy = response.body;
      expect(actualStudy).toStrictEqual(expectedStudy);
      expect(studyCrudMock.findUnique).toBeCalledTimes(1);
      expect(studyCrudMock.findUnique).toBeCalledWith({
        where: { id: expectedStudy.id },
      });
    });

    it('returns Bad Request on invalid UUID', async () => {
      expect.assertions(1);
      const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('returns Not Found on unused UUID', async () => {
      studyCrudMock.findUnique.mockRejectedValueOnce(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.findUnique).toBeCalledTimes(1);
      expect(studyCrudMock.findUnique).toBeCalledWith({
        where: { id: unusedId },
      });
    });
  });

  describe('POST /studies', () => {
    it('returns Not Found on already used UUID', async () => {
      studyCrudMock.create.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send({ study: { id: unusedId } });
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toBeCalledWith({
        data: {
          id: unusedId,
        },
      });
    });

    it('returns study on valid input', async () => {
      const study = studies[1];
      studyCrudMock.create.mockResolvedValueOnce(study);
      expect.assertions(4);
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send({ study: study });
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(expectedStudy);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toBeCalledWith({ data: expectedStudy });
    });
  });

  describe('POST /studies/id', () => {
    it('returns Bad Request on invalid UUID', async () => {
      expect.assertions(1);
      const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
      const response = await request(app.getHttpServer()).post(address);
      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('returns Not Found on already used UUID', async () => {
      studyCrudMock.update.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const name = 'some name';
      const response = await request(app.getHttpServer())
        .post(address)
        .send({ study: { name: name } });
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toBeCalledWith({
        data: {
          name: name,
        },
        where: {
          id: unusedId,
        },
      });
    });

    it('returns study on valid input', async () => {
      const name = 'some name';
      const study = { ...studies[1], name: name };
      studyCrudMock.update.mockResolvedValueOnce(study);
      expect.assertions(4);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer())
        .post(address)
        .send({ study: { name: name } });
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(expectedStudy);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toBeCalledWith({
        data: {
          name: name,
        },
        where: {
          id: expectedStudy.id,
        },
      });
    });
  });

  describe('DELETE /studies/id', () => {
    it('returns Bad Request on invalid UUID', async () => {
      expect.assertions(1);
      const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
      const response = await request(app.getHttpServer()).delete(address);
      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('returns Not Found on unused UUID', async () => {
      studyCrudMock.delete.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const response = await request(app.getHttpServer()).delete(address);
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toBeCalledWith({
        where: {
          id: unusedId,
        },
      });
    });

    it('returns study on valid input', async () => {
      const study = studies[1];
      studyCrudMock.delete.mockResolvedValueOnce(study);
      expect.assertions(4);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer()).delete(address);
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(response.body).toStrictEqual(expectedStudy);
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toBeCalledWith({
        where: { id: expectedStudy.id },
      });
    });
  });

  describe('GET /studies/count/active', () => {
    const address = `${baseRoute}/count/active`;

    it('returns Internal Server Error on missing database connection', async () => {
      studyCrudMock.count.mockRejectedValueOnce(dbConnectionError);
      expect.assertions(1);
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('returns count', async () => {
      const studyCount = 712;
      studyCrudMock.count.mockResolvedValueOnce(studyCount);
      expect.assertions(4);
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(response.body).toStrictEqual({ count: studyCount });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({ where: { isActive: true } });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
