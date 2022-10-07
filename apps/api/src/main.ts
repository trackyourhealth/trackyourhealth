import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  DataTransformerInterceptor,
  HttpExceptionFilter,
} from '@trackyourhealth/api/common/util';
import helmet from 'helmet';

import { AppModule } from './app/app.module';
import { createValidationPipe } from './app/initializers/app.initializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  app.use(helmet());

  const globalPrefix = configService.get('api.apiPrefix');
  app.setGlobalPrefix(globalPrefix);

  // register some global pipes
  app.useGlobalPipes(createValidationPipe());

  app.useGlobalInterceptors(new DataTransformerInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.get('api.port');

  const swaggerConfig = new DocumentBuilder()
    .setTitle(configService.get('api.name'))
    .setDescription('API Documentation')
    .addBearerAuth(
      {
        description: 'Send the Auth Token as "X-Session-Token" http header.',
        type: 'apiKey',
        in: 'header',
        name: 'x-session-token',
      },
      'kratos',
    )
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
