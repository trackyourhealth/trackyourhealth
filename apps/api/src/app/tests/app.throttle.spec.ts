import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import * as request from 'supertest';

import { ThrottleTestController } from './../controllers/test.throttle.controller';

describe('Api Throttle', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 10,
          limit: 5,
        }),
      ],
      controllers: [ThrottleTestController],
    }).compile();

    app = module.createNestApplication();

    globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('Api Throttle', () => {
    it('throw an error after a few requests', async () => {
      // these requests should work
      for (let i = 1; i <= 5; i++) {
        const response = await request(app.getHttpServer()).get(`/api/tests`);
        expect(response.status).toStrictEqual(HttpStatus.OK);
      }

      const responseThatFails = await request(app.getHttpServer()).get(
        `/api/tests`,
      );
      expect(responseThatFails.status).not.toStrictEqual(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
