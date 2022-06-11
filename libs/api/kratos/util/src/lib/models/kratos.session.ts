import { Session } from '@ory/kratos-client';

export interface KratosSession extends Session {
  id: string;
}
