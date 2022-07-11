import { Type } from '@nestjs/class-transformer';
import { IsDefined, ValidateNested } from '@nestjs/class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface DataInput<C> {
  data: C;
}

export function GenerateDataRequest<C>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  InputClass: Class<C>,
): Class<DataInput<C>> {
  class ApiDataRequest implements DataInput<C> {
    @ApiProperty()
    @IsDefined()
    @Type(() => InputClass)
    @ValidateNested()
    data!: C;
  }

  return ApiDataRequest;
}
