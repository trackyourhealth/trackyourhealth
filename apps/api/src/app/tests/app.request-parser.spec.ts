import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { RequestParserTestController } from './../controllers/test.request-parser.controller';

describe('Request Parser', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [],
      controllers: [RequestParserTestController],
    }).compile();

    app = module.createNestApplication();

    globalPrefix = 'api';
    app.setGlobalPrefix(globalPrefix);

    await app.init();
  });

  describe('Request Parameters', () => {
    it('should be defined', () => {
      expect(app).toBeDefined();
    });

    it('should parse request parameters with default values', async () => {
      const response = await request(app.getHttpServer()).get(`/api/tests`);
      expect(response.body).toMatchObject({
        page: 1,
        skip: 0,
        take: 20,
        sort: [{ id: 'asc' }],
      });
    });

    it('should parse request parameters', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/tests?page=5&limit=10`,
      );
      expect(response.body).toMatchObject({
        page: 5,
        skip: 40,
        take: 10,
        sort: [{ id: 'asc' }],
      });
    });
  });
});
