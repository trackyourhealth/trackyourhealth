import { ApiProperty } from '@nestjs/swagger';
import { CoreResponse } from '@trackyourhealth/api/core/util';

export class AuthTokenResponse extends CoreResponse {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty()
  tokenType!: string;

  @ApiProperty()
  refreshToken!: string;

  @ApiProperty()
  expiresIn!: number;
}
