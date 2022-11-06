import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { createValidationPipe } from '@trackyourhealth/api/common/util';
import {
  ApiInstrumentDataModule,
  ApiInstrumentEvaluationService,
} from '@trackyourhealth/api/instrument/data';
import { KratosGuard } from '@trackyourhealth/api/kratos/util';
import {
  instrumentCrudMock,
  internalServerErrorFixture,
  kratosMock,
} from '@trackyourhealth/api/testing/util';
import * as request from 'supertest';

import { ApiInstrumentFeatureModule } from './api-instrument-feature.module';

const evaluationMock = {
  evaluateInstrument: jest.fn(),
};

const defaultQueryValues = {
  orderBy: [{ id: 'asc' }],
  skip: 0,
  take: 20,
};
const dbConnectionError = internalServerErrorFixture._unsafeUnwrapErr();

describe('ApiInstrumentFeature', () => {
  const uuidv4 = '13d03587-5896-41fa-8dc0-7214200cf48f';
  const baseRoute = `/studies/${uuidv4}/instruments`;
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ApiInstrumentFeatureModule,
        ApiInstrumentDataModule,
        ThrottlerModule.forRoot(),
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(instrumentCrudMock.service)
      .overrideProvider(ApiInstrumentEvaluationService)
      .useValue(evaluationMock)
      .overrideGuard(KratosGuard)
      .useValue(kratosMock.guard)
      .compile();

    app = module.createNestApplication();
    app.useGlobalPipes(createValidationPipe());
    await app.init();
  });

  beforeEach(() => {
    evaluationMock.evaluateInstrument.mockClear();
    instrumentCrudMock.clearMocks();
  });

  describe('GET /instruments', () => {
    it('returns Forbidden on failed authorization', async () => {
      kratosMock.canActivate.mockResolvedValueOnce(false);
      expect.assertions(1);
      const response = await request(app.getHttpServer()).get(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.FORBIDDEN);
    });

    it('returns Internal Server Error on missing database connection', async () => {
      instrumentCrudMock.findMany.mockRejectedValueOnce(dbConnectionError);
      instrumentCrudMock.count.mockRejectedValueOnce(dbConnectionError);
      expect.assertions(5);
      const response = await request(app.getHttpServer()).get(baseRoute);
      // FIXME: try-catch-block is missing in crud service
      expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(instrumentCrudMock.findMany).toBeCalledTimes(1);
      expect(instrumentCrudMock.findMany).toBeCalledWith(defaultQueryValues);
      expect(instrumentCrudMock.count).toBeCalledTimes(1);
      expect(instrumentCrudMock.count).toBeCalledWith({});
    });
  });

  describe('POST /instruments', () => {
    it('returns Unprocessable Entity on empty body', async () => {
      expect.assertions(2);
      const response = await request(app.getHttpServer()).post(baseRoute);
      expect(response.status).toStrictEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(instrumentCrudMock.create).toBeCalledTimes(0);
    });
  });

  /* it('events should be thrown', async () => {
    const result = { name: 'test name' };
    expect.assertions(6);
    evaluationMock.evaluateInstrument.mockRejectedValueOnce(
      new Error('evaluation error'),
    );
    instrumentCrudMock.create.mockResolvedValueOnce(result);
    const response = await request(app.getHttpServer())
      .post(baseRoute)
      .send({ answers: result });
    expect(response.status).toStrictEqual(HttpStatus.CREATED);
    expect(response.body).toStrictEqual(result);
    expect(instrumentCrudMock.create).toBeCalledTimes(1);
    expect(instrumentCrudMock.create).toBeCalledWith({
      data: result,
    });
    expect(evaluationMock.evaluateInstrument).toBeCalledTimes(1);
    expect(evaluationMock.evaluateInstrument).toBeCalledWith(result);
  }); */

  afterAll(async () => {
    await app.close();
  });
});
