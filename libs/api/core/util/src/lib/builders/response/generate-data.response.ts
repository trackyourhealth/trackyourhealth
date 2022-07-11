import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface DataOutput<C> {
  data: C;
}

export function GenerateDataResponse<C>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OutputClass: Class<C>,
): Class<DataOutput<C>> {
  class ApiDataResponse implements DataOutput<C> {
    @ApiProperty()
    data!: C;
  }

  return ApiDataResponse;
}
