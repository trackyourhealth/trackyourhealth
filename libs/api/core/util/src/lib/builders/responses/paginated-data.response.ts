import { ApiProperty } from '@nestjs/swagger';

import { Class } from '../class';

export interface PaginatedDataOutput<C> {
  data: C[];
  meta: {
    totalCount: number;
    count: number;
    totalPages: number;
    page: number;
  };
}

export function CreatePaginatedDataResponse<C>(): Class<
  PaginatedDataOutput<C>
> {
  class CreatePaginatedDataOutput implements PaginatedDataOutput<C> {
    @ApiProperty({ isArray: true })
    data!: C[];

    @ApiProperty()
    meta!: ApiMetaDataProperty;
  }

  return CreatePaginatedDataOutput;
}

class ApiMetaDataProperty {
  @ApiProperty({ description: 'total amount of items found', type: 'number' })
  totalCount!: number;

  @ApiProperty({ description: 'amount of items on this page', type: 'number' })
  count!: number;

  @ApiProperty({ description: 'total amount of pages found', type: 'number' })
  totalPages!: number;

  @ApiProperty({ description: 'current page number', type: 'number' })
  page!: number;
}
