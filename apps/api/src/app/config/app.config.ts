import {
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';

export const getValidationPipe = () =>
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
  });
