import { ApiProperty } from '@nestjs/swagger';

import { CoreResponse } from './core.response';

export abstract class IdentifiableResponse extends CoreResponse {
  @ApiProperty({
    type: 'string',
    format: 'uuid',
    description: 'The ID of this Resource',
  })
  id!: string;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date of this Resource was created',
  })
  createdAt!: Date;

  @ApiProperty({
    type: 'string',
    format: 'date-time',
    description: 'Date of this Resource was updated',
  })
  updatedAt!: Date;
}
