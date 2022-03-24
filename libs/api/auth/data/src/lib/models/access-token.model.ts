import { CoreModel } from '@trackyourhealth/api/core/util';

export interface AccessTokenModel extends CoreModel {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
  expiresIn: number;
}
