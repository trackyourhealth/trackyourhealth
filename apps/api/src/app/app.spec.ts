import { HttpStatus, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  DataTransformerInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import helmet from 'helmet';
import * as request from 'supertest';

import { AppModule } from './app.module';
import { createValidationPipe } from './initializers/app.initializer';

describe('App', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const configService = app.get(ConfigService);

    app.enableCors();
    app.use(helmet());

    globalPrefix = configService.get('api.apiPrefix');
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(createValidationPipe());

    app.useGlobalInterceptors(new DataTransformerInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET global prefix', () => {
    it('should return OK', async () => {
      const response = await request(app.getHttpServer()).get(
        `/${globalPrefix}`,
      );
      expect(response.status).toStrictEqual(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
