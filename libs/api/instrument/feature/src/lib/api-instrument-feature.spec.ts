import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import {
  ApiInstrumentDataModule,
  ApiInstrumentEvaluationService,
} from '@trackyourhealth/api/instrument/data';
import * as request from 'supertest';

import { ApiInstrumentFeatureModule } from './api-instrument-feature.module';

const instrumentCrudMock = {
  instrument: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const evaluationMock = {
  evaluateInstrument: jest.fn(),
};

describe('apiInstrumentFeature', () => {
  const baseRoute = '/instruments';
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiInstrumentFeatureModule, ApiInstrumentDataModule],
    })
      .overrideProvider(PrismaService)
      .useValue(instrumentCrudMock)
      .overrideProvider(ApiInstrumentEvaluationService)
      .useValue(evaluationMock)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    evaluationMock.evaluateInstrument.mockClear();
    instrumentCrudMock.instrument.create.mockClear();
    instrumentCrudMock.instrument.findMany.mockClear();
  });

  it('should work', async () => {
    const result = { msg: 'hi' };
    instrumentCrudMock.instrument.findMany.mockResolvedValueOnce(result);
    const response = await request(app.getHttpServer()).get(baseRoute);
    expect(response.status).toStrictEqual(HttpStatus.OK);
    expect(response.body).toStrictEqual(result);
  });

  it('events should be thrown', async () => {
    const result = { name: 'test name' };
    expect.assertions(6);
    evaluationMock.evaluateInstrument.mockRejectedValueOnce(
      new Error('evaluation error'),
    );
    instrumentCrudMock.instrument.create.mockResolvedValueOnce(result);
    const response = await request(app.getHttpServer())
      .post(baseRoute)
      .send({ answers: result });
    expect(response.status).toStrictEqual(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(result);
    expect(instrumentCrudMock.instrument.create).toBeCalledTimes(1);
    expect(instrumentCrudMock.instrument.create).toBeCalledWith({
      data: result,
    });
    expect(evaluationMock.evaluateInstrument).toBeCalledTimes(1);
    expect(evaluationMock.evaluateInstrument).toBeCalledWith(result);
  });

  afterAll(async () => {
    await app.close();
  });
});
