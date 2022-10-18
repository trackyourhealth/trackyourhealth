import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { HttpExceptionFilter } from '@trackyourhealth/api/common/util';
import helmet from 'helmet';
import * as request from 'supertest';

import { GeneralTestController } from './../controllers/test.general.controller';

describe('Api General', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [GeneralTestController],
    }).compile();

    app = module.createNestApplication();

    app.enableCors();
    app.use(helmet());

    globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('Api Global Prefix', () => {
    it('should return OK', async () => {
      const response = await request(app.getHttpServer()).get(`/api/tests`);
      expect(response.status).toStrictEqual(HttpStatus.OK);
    });

    it('should fail for other routes return OK', async () => {
      const response = await request(app.getHttpServer()).get(`/foobar/tests`);
      expect(response.status).not.toStrictEqual(HttpStatus.OK);
    });
  });

  describe('Api Exception Filter', () => {
    it('should fail for unknown routes', async () => {
      const response = await request(app.getHttpServer()).get(`/unknown/route`);
      expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
    });

    it('should format the exception using the ExceptionFilter', async () => {
      const response = await request(app.getHttpServer()).get(`/unknown/route`);
      expect(response.body).toMatchObject({
        error: {
          message: 'Cannot GET /unknown/route',
          details: 'Not Found',
          path: '/unknown/route',
          request: {
            path: '/unknown/route',
          },
        },
      });
    });
  });

  describe('Api Helmet', () => {
    it('should use Helmet', async () => {
      const response = await request(app.getHttpServer()).get(`/`);

      expect(response.headers).toHaveProperty('content-security-policy');
      expect(response.headers).toHaveProperty('cross-origin-embedder-policy');
      expect(response.headers).toHaveProperty('cross-origin-opener-policy');
      expect(response.headers).toHaveProperty('cross-origin-resource-policy');

      expect(response.headers).not.toHaveProperty('x-powered-by');
    });
  });

  describe('Api CORS', () => {
    it('should enable CORS', async () => {
      const response = await request(app.getHttpServer()).get(`/`);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
