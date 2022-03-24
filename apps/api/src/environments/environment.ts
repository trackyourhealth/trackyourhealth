import * as dotenv from 'dotenv';
import * as env from 'env-var';

import { ApplicationConfiguration } from './../app/interfaces/application.configuration';

dotenv.config();

export default () =>
  ({
    production: false,

    api: {
      apiPrefix: env.get('API_PREFIX').default('api').asString(),
      port: env.get('API_PORT').default(3000).asPortNumber(),
      docs: {
        version: '1.0',
        path: 'api/.well-known/openapi',
      },
    },

    auth: {
      jwt: {
        secret: env.get('JWT_SECRET').required().asString(),
        expiresIn: env.get('JWT_EXPIRES_IN').required().asIntPositive(),
        refreshIn: env.get('JWT_REFRESH_IN').required().asIntPositive(),
        bcryptSaltRounds: env
          .get('JWT_BCRYPT_SALTROUNDS')
          .required()
          .asIntPositive(),
      },
    },

    security: {
      throttler: {
        ttl: env.get('API_THROTTLER_TTL').default(60).asIntPositive(),
        limit: env.get('API_THROTTLER_LIMIT').default(10).asIntPositive(),
      },
    },
  } as ApplicationConfiguration);
