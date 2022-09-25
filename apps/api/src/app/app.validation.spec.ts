import {
  HttpStatus,
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import {
  DataTransformerInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import { CreateStudyInput } from '@trackyourhealth/api/study/data';
import {
  getStudyDateStringified,
  kratosMock,
  studies,
  studyCrudMock,
} from '@trackyourhealth/api/testing/util';
import helmet from 'helmet';
import * as request from 'supertest';

import { AppModule } from './app.module';

describe('App validation', () => {
  let app: INestApplication;
  let globalPrefix: string;
  let studiesBaseRoute: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(KratosGuard)
      .useValue(kratosMock.guard)
      .overrideProvider(PrismaService)
      .useValue(studyCrudMock.service)
      .compile();

    app = module.createNestApplication();
    const configService = app.get(ConfigService);

    app.enableCors();
    app.use(helmet());

    globalPrefix = configService.get('api.apiPrefix');
    app.setGlobalPrefix(globalPrefix);
    studiesBaseRoute = `/${globalPrefix}/studies`;

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        skipMissingProperties: false,
        skipUndefinedProperties: false,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        // disable the use of @nestjs packages here for now, otherwise mapped-types does not work properly
        // validatorPackage: require('@nestjs/class-validator'),
        // transformerPackage: require('@nestjs/class-transformer'),
        exceptionFactory: (errors) =>
          new UnprocessableEntityException({
            title: 'Validation Exception',
            message: 'Validation failed',
            error: errors,
          }),
      }),
    );

    app.useGlobalInterceptors(new DataTransformerInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  beforeEach(() => {
    studyCrudMock.clearMocks();
  });

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('validation success on POST /studies', () => {
    it('should return Created on valid body', async () => {
      const study = studies[1];
      studyCrudMock.create.mockResolvedValueOnce(study);
      expect.assertions(4);
      const body: CreateStudyInput = {
        name: 'test name',
        title: {},
        description: {},
        isActive: true,
        startsAt: new Date(),
      };
      const response = await request(app.getHttpServer())
        .post(studiesBaseRoute)
        .send({ data: body });
      const expectedStudy = getStudyDateStringified(study);
      expect(response.status).toStrictEqual(HttpStatus.CREATED);
      expect(response.body.data).toStrictEqual(expectedStudy);
      expect(studyCrudMock.create).toBeCalledTimes(1);
      expect(studyCrudMock.create).toBeCalledWith({ data: body });
    });
  });

  describe('validation fail on POST /studies', () => {
    it('should return Unprocessable Entity on empty body', async () => {
      studyCrudMock.create.mockResolvedValueOnce(studies[1]);
      expect.assertions(2);
      const response = await request(app.getHttpServer()).post(
        studiesBaseRoute,
      );
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('should return Unprocessable Entity on empty body.data', async () => {
      studyCrudMock.create.mockResolvedValueOnce(studies[1]);
      expect.assertions(2);
      const response = await request(app.getHttpServer())
        .post(studiesBaseRoute)
        .send({ data: {} });
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('should return Unprocessable Entity on missing required field', async () => {
      expect.assertions(2);
      const bodyNoName = {
        title: {},
        description: {},
        isActive: true,
        startsAt: new Date(),
      };
      const response = await request(app.getHttpServer())
        .post(studiesBaseRoute)
        .send({ data: bodyNoName });
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('should return Unprocessable Entity on wrong title type', async () => {
      expect.assertions(2);
      const bodyWrongTitle = {
        name: 'test name',
        title: 'wrong type',
        description: {},
        isActive: true,
        startsAt: new Date(),
      };
      const response = await request(app.getHttpServer())
        .post(studiesBaseRoute)
        .send({ data: bodyWrongTitle });
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });

    it('should return Unprocessable Entity on unsupported date format', async () => {
      expect.assertions(2);
      const bodyWrongDate = {
        name: 'test name',
        title: {},
        description: {},
        isActive: true,
        startsAt: new Date('23.09.2022'),
      };
      const response = await request(app.getHttpServer())
        .post(studiesBaseRoute)
        .send({ data: bodyWrongDate });
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(studyCrudMock.create).toBeCalledTimes(0);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
