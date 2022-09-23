import {
  HttpStatus,
  INestApplication,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import {
  DataTransformerInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import helmet from 'helmet';
import * as request from 'supertest';

import { AppModule } from './app.module';

describe('App', () => {
  let app: INestApplication;
  let globalPrefix: string;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    const configService = app.get(ConfigService);

    app.enableCors();
    app.use(helmet());

    globalPrefix = configService.get('api.apiPrefix');
    app.setGlobalPrefix(globalPrefix);

    // register some global pipes
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        skipMissingProperties: false,
        skipUndefinedProperties: false,
        forbidNonWhitelisted: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        // disable the use of @nestjs packages here for now, otherwise mapped-types does not work properly
        // validatorPackage: require('@nestjs/class-validator'),
        // transformerPackage: require('@nestjs/class-transformer'),
        exceptionFactory: (errors) =>
          new UnprocessableEntityException({
            title: 'Validation Exception',
            message: 'Validation failed',
            error: errors,
          }),
      }),
    );

    app.useGlobalInterceptors(new DataTransformerInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  it('should be defined', () => {
    expect(app).toBeDefined();
  });

  describe('GET global prefix', () => {
    it('should return OK', async () => {
      expect.assertions(2);
      const response = await request(app.getHttpServer()).get(
        `/${globalPrefix}`,
      );
      expect(response.status).toStrictEqual(HttpStatus.OK);
      expect(response.body).toStrictEqual({
        data: { message: 'Welcome to api!' },
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
