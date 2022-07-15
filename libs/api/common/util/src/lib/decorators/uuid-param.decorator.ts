import { Param, ParseUUIDPipe, ParseUUIDPipeOptions } from '@nestjs/common';

export type UUIDVersion = '3' | '4' | '5';

// Default UUID-version of Prisma is 4
// Providing no version results in matching all UUID-versions
export const UUIDParam = (id: string, version: UUIDVersion = '4') => {
  const options: ParseUUIDPipeOptions = {
    version: version,
  };
  return Param(id, new ParseUUIDPipe(options));
};
