import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { RequestParserTestController } from './test.request-parser.controller';

describe('API Request Parser', () => {
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
        filter: {},
      });
    });

    it('should parse request parameters', async () => {
      const response = await request(app.getHttpServer()).get(
        `/api/tests?page=5&limit=10&filter={"foo":true,"bar":123}`,
      );
      expect(response.body).toMatchObject({
        page: 5,
        skip: 40,
        take: 10,
        sort: [{ id: 'asc' }],
        filter: { foo: true, bar: 123 },
      });
    });
  });
});
