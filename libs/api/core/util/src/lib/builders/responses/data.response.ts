import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface DataOutput<C> {
  data: C;
}

export function CreateDataResponse<C>(
  OutputClass: Class<C>,
): Class<DataOutput<C>> {
  class CreateDataOutput implements DataOutput<C> {
    @ApiProperty()
    data!: C;
  }

  return CreateDataOutput;
}
