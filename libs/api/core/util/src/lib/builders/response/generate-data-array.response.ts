import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface DataArrayOutput<C> {
  data: C[];
}

export function GenerateDataArrayResponse<C>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OutputClass: Class<C>,
): Class<DataArrayOutput<C>> {
  class ApiArrayDataResponse implements DataArrayOutput<C> {
    @ApiProperty({ isArray: true })
    data!: C[];
  }

  return ApiArrayDataResponse;
}
