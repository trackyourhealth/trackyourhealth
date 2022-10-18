import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { ValidationTestController } from './../controllers/test.validation.controller';
import { createValidationPipe } from './../initializers/app.initializer';

describe('API Validation', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [ValidationTestController],
    }).compile();

    app = module.createNestApplication();

    globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    app.useGlobalPipes(createValidationPipe());

    await app.init();
  });

  beforeEach(() => {
    //
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('success', () => {
    it('should return HTTP CREATED on valid body', async () => {
      const body = {
        name: 'test ',
        isActive: true,
        foo: 12345,
      };

      const response = await request(app.getHttpServer())
        .post(`/api/tests`)
        .send({ data: body });

      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });

  describe('fails', () => {
    it('should fail on empty body', async () => {
      const response = await request(app.getHttpServer())
        .post(`/api/tests`)
        .send({});

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail on wrong datatypes', async () => {
      const body = {
        name: true,
        isActive: 1234,
        foo: 'hello world',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/tests`)
        .send({ data: body });

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail on unknown additional fields', async () => {
      const body = {
        unknownAttribute: true,
        name: 'test',
        isActive: false,
        foo: 1,
      };

      const response = await request(app.getHttpServer())
        .post(`/api/tests`)
        .send({ data: body });

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail on missing attributes', async () => {
      const body = {
        name: 'test',
      };

      const response = await request(app.getHttpServer())
        .post(`/api/tests`)
        .send({ data: body });

      expect(response.status).toBe(HttpStatus.UNPROCESSABLE_ENTITY);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
