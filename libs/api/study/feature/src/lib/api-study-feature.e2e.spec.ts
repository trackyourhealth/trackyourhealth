import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import {
  DataTransformerInterceptor,
  ExceptionInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import { createValidationPipe } from '@trackyourhealth/api/core/util';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import {
  ApiStudyDataModule,
  CreateStudyInput,
  UpdateStudyInput,
} from '@trackyourhealth/api/study/data';
import {
  convertToJsonOutput,
  internalServerErrorFixture,
  kratosMock,
  notFoundErrorFixture,
  wrapToDataObject,
} from '@trackyourhealth/api/testing/util';
import * as request from 'supertest';

import { ApiStudyFeatureModule } from './api-study-feature.module';
import { CreateStudyRequest, UpdateStudyRequest } from './data/requests';
import { studyFixtures } from './tests/fixtures/study.fixtures';
import { studyCrudMock } from './tests/mocks/study.mock.spec';

describe('API Study Feature', () => {
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

    app.useGlobalPipes(createValidationPipe());

    app.useGlobalInterceptors(
      new DataTransformerInterceptor(),
      new ExceptionInterceptor(),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  beforeEach(() => {
    studyCrudMock.clearMocks();
  });

  describe('API', () => {
    it('should be defined', async () => {
      expect(app).toBeDefined();
    });
  });

  describe('GET /studies', () => {
    it('should return all active study entities', async () => {
      const entities = studyFixtures;
      studyCrudMock.findMany.mockResolvedValueOnce(entities);
      studyCrudMock.count.mockResolvedValueOnce(entities.length);

      expect.assertions(5);

      const response = await request(app.getHttpServer()).get(baseRoute);

      const responseItems = response.body.data.items;
      const responseMeta = response.body.data.meta;

      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(responseMeta).toMatchObject({
        totalItems: entities.length,
        items: entities.length,
        totalPages: 1,
        page: 1,
      });
      expect(responseItems).toHaveLength(entities.length);

      expect(studyCrudMock.findMany).toBeCalledTimes(1);
      expect(studyCrudMock.count).toBeCalledTimes(1);
    });
  });

  describe('GET /studies/:id', () => {
    it('should return a study entity', async () => {
      expect.assertions(4);

      const entity = studyFixtures[0];
      studyCrudMock.findUniqueOrThrow.mockResolvedValueOnce(entity);

      const address = `${baseRoute}/${entity.id}`;
      const response = await request(app.getHttpServer()).get(address);

      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(response.body).toMatchObject(wrapToDataObject(entity));
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: entity.id },
      });
    });

    it('should return an error on an invalid UUID', async () => {
      expect.assertions(1);

      const address = `${baseRoute}/invalidUUID`;
      const response = await request(app.getHttpServer()).get(address);

      expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
    });

    it('should return an error on an unknown UUID', async () => {
      expect.assertions(3);

      studyCrudMock.findUniqueOrThrow.mockRejectedValue(notFoundErrorFixture);

      const unknownId = '59888ab2-db26-4185-a89d-9cacc71d7232';
      const address = `${baseRoute}/${unknownId}`;
      const response = await request(app.getHttpServer()).get(address);

      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledTimes(1);
      expect(studyCrudMock.findUniqueOrThrow).toBeCalledWith({
        where: { id: unknownId },
      });
    });
  });

  describe('POST /studies', () => {
    it('should return a study entity on valid input', async () => {
      expect.assertions(3);

      const data: CreateStudyInput = {
        name: 'test',
        title: {},
        description: {},
        isActive: false,
        startsAt: new Date(),
      };

      studyCrudMock.create.mockResolvedValueOnce(data);

      const entity: CreateStudyRequest = {
        data: data,
      };

      const body = convertToJsonOutput(entity);

      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send(body);

      expect(response.status).toStrictEqual(HttpStatus.CREATED);
      expect(response.body).toMatchObject(wrapToDataObject({}));
      expect(studyCrudMock.create).toBeCalledTimes(1);
    });

    it('should return an error on invalid input', async () => {
      expect.assertions(2);

      const data = {
        name: 'test',
      };

      const body = wrapToDataObject(data);
      const response = await request(app.getHttpServer())
        .post(baseRoute)
        .send(body);

      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });
  });

  describe('PATCH /studies/:id', () => {
    it('should return a study entity on valid input', async () => {
      expect.assertions(2);

      const study = studyFixtures[0];

      const data: UpdateStudyInput = {
        name: 'test',
        title: {},
        description: {},
        isActive: false,
        startsAt: new Date(),
      };

      studyCrudMock.update.mockResolvedValueOnce(data);

      const entity: UpdateStudyRequest = {
        data: data,
      };

      const body = convertToJsonOutput(entity);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer())
        .patch(address)
        .send(body);

      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(studyCrudMock.update).toBeCalledTimes(1);
    });

    it('should return an error on invalid input', async () => {
      expect.assertions(2);

      const study = studyFixtures[0];

      const data = {
        foo: 'invalid data',
        bar: 123,
      };

      const body = wrapToDataObject(data);
      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer())
        .patch(address)
        .send(body);

      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('should return an error on unknown UUID', async () => {
      expect.assertions(2);

      studyCrudMock.update.mockRejectedValueOnce(internalServerErrorFixture);

      const data = {};
      const body = wrapToDataObject(data);
      const randomUUID = '930c547b-e02c-4f05-8b3b-f13725575223';
      const address = `${baseRoute}/${randomUUID}`;
      const response = await request(app.getHttpServer())
        .patch(address)
        .send(body);

      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.update).toBeCalledTimes(1);
    });
  });

  describe('DELETE /studies/:id', () => {
    it('should return a study entity', async () => {
      expect.assertions(4);

      const study = studyFixtures[1];
      studyCrudMock.delete.mockResolvedValueOnce({});

      const address = `${baseRoute}/${study.id}`;
      const response = await request(app.getHttpServer()).delete(address);

      expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);
      expect(response.body).toStrictEqual({});
      expect(studyCrudMock.delete).toBeCalledTimes(1);
      expect(studyCrudMock.delete).toBeCalledWith({
        where: { id: study.id },
      });
    });

    it('should return an error on unknown UUID', async () => {
      expect.assertions(2);

      studyCrudMock.delete.mockRejectedValueOnce(internalServerErrorFixture);

      const randomUUID = '930c547b-e02c-4f05-8b3b-f13725575223';
      const address = `${baseRoute}/${randomUUID}`;
      const response = await request(app.getHttpServer()).delete(address);

      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(studyCrudMock.delete).toBeCalledTimes(1);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
