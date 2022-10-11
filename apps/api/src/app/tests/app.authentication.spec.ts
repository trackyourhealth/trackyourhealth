import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import { kratosMock } from '@trackyourhealth/api/testing/util';
import * as request from 'supertest';

import { AppModule } from '../app.module';
import { AuthTestController } from '../controllers/test.auth.controller';

describe('Api Authentication', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AuthTestController],
    })
      .overrideGuard(KratosGuard)
      .useValue(kratosMock.guard)
      .compile();

    app = module.createNestApplication();

    await app.init();
  });

  it('app should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('Auth Test Controller - calling Locked Route', () => {
    it('returns 403 when not logged in', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);

      const response = await request(app.getHttpServer()).get(`/tests/locked`);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns 200 when logged in', async () => {
      const response = await request(app.getHttpServer()).get(`/tests/locked`);
      expect(response.status).toStrictEqual(HttpStatus.OK);
    });
  });

  describe('Auth Test Controller - calling Open Route', () => {
    it('returns 200 when not logged in', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);

      const response = await request(app.getHttpServer()).get(`/tests/open`);
      expect(response.status).toStrictEqual(HttpStatus.OK);
    });

    it('returns 200 when logged in', async () => {
      const response = await request(app.getHttpServer()).get(`/tests/open`);
      expect(response.status).toStrictEqual(HttpStatus.OK);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
