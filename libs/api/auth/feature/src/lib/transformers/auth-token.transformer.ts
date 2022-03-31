import { AccessTokenModel } from '@trackyourhealth/api/auth/data';
import { CoreTransformer } from '@trackyourhealth/api/core/util';

import { AuthTokenResponse } from '../data/responses/auth-token.response';

export class AuthTokenTransformer extends CoreTransformer<
  AccessTokenModel,
  AuthTokenResponse
> {
  transform(entity: AccessTokenModel): AuthTokenResponse {
    return {
      accessToken: entity.accessToken,
      tokenType: entity.tokenType,
      refreshToken: entity.refreshToken,
      expiresIn: entity.expiresIn,
    };
  }
}
