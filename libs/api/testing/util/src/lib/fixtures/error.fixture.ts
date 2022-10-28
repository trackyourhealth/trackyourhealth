import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { err } from 'neverthrow';

export const internalServerErrorFixture = err(
  new InternalServerErrorException(),
);
export const notFoundErrorFixture = err(new NotFoundException());
