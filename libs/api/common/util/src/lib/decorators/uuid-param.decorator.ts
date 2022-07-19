import { Param, ParseUUIDPipe } from '@nestjs/common';

export type UUIDVersion = '3' | '4' | '5';

// Prisma (and the underlying database) rely on v4 UUIDs, therefore we default to v4 in this custom decorator
// Providing no version automatically uses v4 as default
export const UUIDParam = (id: string, version: UUIDVersion = '4') => {
  return Param(
    id,
    new ParseUUIDPipe({
      version: version,
    }),
  );
};
