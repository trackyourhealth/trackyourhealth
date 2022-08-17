import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
} from '@prisma/client/runtime';

export const dbConnectionError = new PrismaClientInitializationError(
  `Can't reach database server`,
  '2.19.0',
  'P1001',
);

export const dbKnownError = new PrismaClientKnownRequestError(
  'A constraint failed on the database',
  'P2004',
  '2.19.0',
);
