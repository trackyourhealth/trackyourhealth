import { ThrottlerModuleOptions } from '@nestjs/throttler';

export interface ApplicationConfiguration {
  production: boolean;

  api: {
    port: number;
    apiPrefix: string;
  };

  security: {
    throttler: ThrottlerModuleOptions;
  };
}
