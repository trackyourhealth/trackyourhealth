import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface PaginatedDataOutput<C> {
  data: C[];
  meta: {
    totalItems: number;
    items: number;
    totalPages: number;
    page: number;
  };
}

export function GeneratePaginatedDataResponse<C>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  OutputClass: Class<C>,
): Class<PaginatedDataOutput<C>> {
  class ApiPaginatedDataResponse implements PaginatedDataOutput<C> {
    @ApiProperty({ isArray: true })
    data!: C[];

    @ApiProperty()
    meta!: ApiMetaDataProperty;
  }

  return ApiPaginatedDataResponse;
}

class ApiMetaDataProperty {
  @ApiProperty({ description: 'total amount of items found', type: 'number' })
  totalItems!: number;

  @ApiProperty({ description: 'amount of items on this page', type: 'number' })
  items!: number;

  @ApiProperty({ description: 'total amount of pages found', type: 'number' })
  totalPages!: number;

  @ApiProperty({ description: 'current page number', type: 'number' })
  page!: number;
}
