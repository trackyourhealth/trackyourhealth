import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface DataArrayOutput<C> {
  data: C[];
}

export function CreateDataArrayResponse<C>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OutputClass: Class<C>,
): Class<DataArrayOutput<C>> {
  class CreateDataArrayOutput implements DataArrayOutput<C> {
    @ApiProperty({ isArray: true })
    data!: C[];
  }

  return CreateDataArrayOutput;
}
