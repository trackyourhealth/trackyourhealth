import { CoreModel } from '@trackyourhealth/api/core/util';

export interface CredentialsModel extends CoreModel {
  email: string;
  password: string;
}
