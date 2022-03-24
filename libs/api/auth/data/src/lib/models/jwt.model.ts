import { CoreModel } from '@trackyourhealth/api/core/util';

export interface JwtModel extends CoreModel {
  userId: string;
}
