import {
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { TrimPipe } from '@trackyourhealth/api/common/util';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(helmet());

  const globalPrefix = configService.get('api.apiPrefix');
  app.setGlobalPrefix(globalPrefix);

  // register some global pipes
  // app.useGlobalPipes(new TrimPipe());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      skipMissingProperties: false,
      skipUndefinedProperties: false,
      forbidNonWhitelisted: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      validatorPackage: require('@nestjs/class-validator'),
      transformerPackage: require('@nestjs/class-transformer'),
      exceptionFactory: (errors) =>
        new UnprocessableEntityException({
          title: 'Validation Exception',
          message: 'Validation failed',
          error: errors,
        }),
    }),
  );

  const port = configService.get('api.port');

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('api.name'))
    .setDescription('API Documentation')
    .addBearerAuth()
    .setVersion(configService.get('api.docs.version'))
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {});
  const swaggerPath = configService.get('api.docs.path');
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port, () => {
    Logger.log(
      `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );

    Logger.log(`📚 Docs available on: http://localhost:${port}/${swaggerPath}`);
  });
}

bootstrap();
