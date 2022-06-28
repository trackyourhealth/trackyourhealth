import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import * as request from 'supertest';

import { prismaStudyMock } from '../../../mocks';
import { apiStudyFeature } from './api-study-feature';
import { ApiStudyFeatureModule } from './api-study-feature.module';

describe('ApiStudyFeature', () => {
  let app: INestApplication;
  const baseRoute = '/api-study-feature';

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [ApiStudyFeatureModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prismaStudyMock.service)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('should work', () => {
    expect(apiStudyFeature()).toEqual('api-study-feature');
  });

  it('/GET studies', async () => {
    const expectedStudies = prismaStudyMock.getActiveStudies();
    expect.assertions(2 + expectedStudies.length);
    const response = await request(app.getHttpServer()).get(baseRoute);
    expect(response.status).toStrictEqual(HttpStatus.OK);
    const studies = response.body;
    expect(studies.length).toStrictEqual(expectedStudies.length);
    for (let i = 0; i < expectedStudies.length; i++) {
      expect(expectedStudies[i].id).toStrictEqual(studies[i].id);
    }
  });

  it('/GET study', async () => {
    expect.assertions(2);
    const expectedStudy = prismaStudyMock.getFirstStudy();
    const response = await request(app.getHttpServer()).get(
      `${baseRoute}/${expectedStudy.id}`,
    );
    expect(response.status).toStrictEqual(HttpStatus.OK);
    const study = response.body;
    expect(study.id).toStrictEqual(expectedStudy.id);
  });

  it('/GET study fail', async () => {
    expect.assertions(1);
    const response = await request(app.getHttpServer()).get(
      `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`,
    );
    expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
