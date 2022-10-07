import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import {
  DataTransformerInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import { kratosMock, studyCrudMock } from '@trackyourhealth/api/testing/util';
import helmet from 'helmet';
import * as request from 'supertest';

import { AppModule } from './app.module';
import { createValidationPipe } from './initializers/app.initializer';

describe('App authentification', () => {
  let app: INestApplication;
  let globalPrefix: string;
  let studyBaseRoute: string;

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
    studyBaseRoute = `/${globalPrefix}/studies`;

    app.useGlobalPipes(createValidationPipe());

    app.useGlobalInterceptors(new DataTransformerInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  beforeEach(studyCrudMock.clearMocks);

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('return value on authorization success', () => {
    it('should return OK', async () => {
      const response = await request(app.getHttpServer()).get(studyBaseRoute);
      expect(response.status).not.toStrictEqual(HttpStatus.FORBIDDEN);
    });
  });

  describe('error on authoriztaion fail', () => {
    it('return Forbidden on authorization fail', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const response = await request(app.getHttpServer()).get(studyBaseRoute);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
