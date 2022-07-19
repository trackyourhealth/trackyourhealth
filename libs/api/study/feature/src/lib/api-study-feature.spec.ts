import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '@prisma-utils/nestjs-prisma';
import { prismaStudyMock } from '@trackyourhealth/api/testing/util';
import * as request from 'supertest';

import { ApiStudyFeatureModule } from './api-study-feature.module';

describe('ApiStudyFeature', () => {
  let app: INestApplication;
  const baseRoute = '/studies';

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
    const address = `${baseRoute}/${expectedStudy.id}`;
    const response = await request(app.getHttpServer()).get(address);
    expect(response.status).toStrictEqual(HttpStatus.OK);
    const study = response.body;
    expect(study.id).toStrictEqual(expectedStudy.id);
  });

  it('/GET study invalid UUID', async () => {
    expect.assertions(1);
    const address = `${baseRoute}/invalidStudyIdThatShouldNeverBeUsed`;
    const response = await request(app.getHttpServer()).get(address);
    expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
  });

  it('/GET study unused UUID', async () => {
    expect.assertions(1);
    const address = `${baseRoute}/b1f05ae3-4947-4c7d-9e6c-edc74e90cdfa`;
    const response = await request(app.getHttpServer()).get(address);
    expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
  });

  afterAll(async () => {
    await app.close();
  });
});
