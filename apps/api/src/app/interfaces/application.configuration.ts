import { ThrottlerModuleOptions } from '@nestjs/throttler';

export interface ApplicationConfiguration {
  production: boolean;

  api: {
    port: number;
    apiPrefix: string;
  };

  auth: {
    kratos: {
      baseUrl: string;
    };
  };

  security: {
    throttler: ThrottlerModuleOptions;
  };
}
