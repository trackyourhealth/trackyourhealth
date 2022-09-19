import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import {
  ApiStudyDataModule,
  UpdateStudyInput,
} from '@trackyourhealth/api/study/data';
import {
  dbConnectionError,
  dbKnownError,
  defaultQueryValues,
  getCreateStudyInput,
  getStudyDateStringified,
  kratosMock,
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
      imports: [
        ApiStudyFeatureModule,
        ApiStudyDataModule,
        ThrottlerModule.forRoot(),
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(studyCrudMock.service)
      .overrideGuard(KratosGuard)
      .useValue(kratosMock.guard)
      .compile();

    app = module.createNestApplication({ logger: false });
    await app.init();
  });

  beforeEach(() => {
    studyCrudMock.clearMocks();
  });

  describe('GET /studies', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns all active studies', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(7 + studies.length);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const actualStudies = response.body.items;
      expect(actualStudies.length).toStrictEqual(studies.length);
      for (let i = 0; i < studies.length; i++) {
        const expectedStudy = getStudyDateStringified(studies[i]);
        expect(actualStudies[i]).toStrictEqual(expectedStudy);
      }
      expect(response.body.meta).toStrictEqual({
        totalItems: studies.length,
        items: studies.length,
        totalPages: 1,
        page: 1,
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        ...defaultQueryValues,
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });

    it('returns Internal Server Error on missing database connection', async () => {
      studyCrudMock.findMany.mockRejectedValueOnce(dbConnectionError);
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(5);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        ...defaultQueryValues,
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });

    it('parses additional request parameters', async () => {
      studyCrudMock.findMany.mockResolvedValueOnce(studies);
      studyCrudMock.count.mockResolvedValueOnce(studies.length);
      expect.assertions(7 + studies.length);
      const limit = 17;
      const page = 4;
      const address = `${baseRoute}/?limit=${limit}&page=${page}&sort=-id,createdAt`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const actualStudies = response.body.items;
      expect(actualStudies.length).toStrictEqual(studies.length);
      for (let i = 0; i < studies.length; i++) {
        const expectedStudy = getStudyDateStringified(studies[i]);
        expect(actualStudies[i]).toStrictEqual(expectedStudy);
      }
      expect(response.body.meta).toStrictEqual({
        totalItems: studies.length,
        items: studies.length,
        totalPages: 1,
        page: 4,
      });
      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.findMany).toBeCalledWith({
        orderBy: [{ id: 'desc' }, { createdAt: 'asc' }],
        take: limit,
        skip: limit * (page - 1),
        where: { isActive: true },
      });
      expect(studyCrudMock.count).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledWith({
        where: { isActive: true },
      });
    });
  });

  describe('GET /studies/id', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const address = `${baseRoute}/b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns study on valid id', async () => {
      const study = studies[1];
      studyCrudMock.findUniqueOrThrow.mockResolvedValueOnce(study);
      expect.assertions(4);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      const expectedStudy = getStudyDateStringified(study);
      const actualStudy = response.body;
      expect(actualStudy).toStrictEqual(expectedStudy);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
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
      studyCrudMock.findUniqueOrThrow.mockRejectedValueOnce(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const response = await request(app.getHttpServer()).get(address);
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: unusedId },
      });
    });
  });

  describe('POST /studies', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const response = await request(app.getHttpServer()).post(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns Not Found on already used name', async () => {
      studyCrudMock.create.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const name = 'some name';
      const body = getCreateStudyInput({ name: name });
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send({ data: body });
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toBeCalledWith({ data: body });
    });

    it('returns Internal Server Error on invalid body', async () => {
      studyCrudMock.create.mockResolvedValueOnce(studies[1]);
      expect.assertions(2);
      const name = 'some name';
      const body = { name: name };
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send(body);
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('returns study on valid input', async () => {
      const study = studies[1];
      studyCrudMock.create.mockResolvedValueOnce(study);
      expect.assertions(4);
      const body = getCreateStudyInput({
        name: study.name,
        startsAt: study.startsAt,
      });
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send({ data: body });
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.CREATED);
      expect(response.body).toStrictEqual(expectedStudy);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toBeCalledWith({ data: body });
    });
  });

  describe('PATCH /studies/id', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const address = `${baseRoute}/b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa`;
      const response = await request(app.getHttpServer()).patch(address);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns Bad Request on invalid UUID', async () => {
      expect.assertions(1);
      const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
      const response = await request(app.getHttpServer()).patch(address);
      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('returns Internal Server Error on already used UUID', async () => {
      studyCrudMock.update.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const name = 'some name';
      const body: UpdateStudyInput = { name: name };
      const response = await request(app.getHttpServer())
        .patch(address)
        .send({ data: body });
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toBeCalledWith({
        data: body,
        where: { id: unusedId },
      });
    });

    it('returns study on valid input', async () => {
      const name = 'some name';
      const study = { ...studies[1], name: name };
      studyCrudMock.update.mockResolvedValueOnce(study);
      expect.assertions(4);
      const address = `${baseRoute}/${study.id}`;
      const body: UpdateStudyInput = { name: name };
      const response = await request(app.getHttpServer())
        .patch(address)
        .send({ data: body });
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(response.body).toStrictEqual(expectedStudy);
      expect(studyCrudMock.update).toBeCalledTimes(1);
      expect(studyCrudMock.update).toBeCalledWith({
        data: body,
        where: { id: expectedStudy.id },
      });
    });
  });

  describe('DELETE /studies/id', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const address = `${baseRoute}/b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa`;
      const response = await request(app.getHttpServer()).delete(address);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns Bad Request on invalid UUID', async () => {
      expect.assertions(1);
      const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
      const response = await request(app.getHttpServer()).delete(address);
      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('returns Internal Server Error on unused UUID', async () => {
      studyCrudMock.delete.mockRejectedValue(dbKnownError);
      expect.assertions(3);
      const unusedId = 'b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa';
      const address = `${baseRoute}/${unusedId}`;
      const response = await request(app.getHttpServer()).delete(address);
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
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
      expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);
      expect(response.body).toStrictEqual({});
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toBeCalledWith({
        where: { id: expectedStudy.id },
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
