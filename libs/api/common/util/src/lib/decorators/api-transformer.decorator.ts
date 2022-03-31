import { SetMetadata } from '@nestjs/common';
import { Class } from '@trackyourhealth/api/core/util';
import { DECORATOR_CONSTANTS } from '@trackyourhealth/api/core/util';
import { CoreTransformer } from '@trackyourhealth/api/core/util';

export const ApiTransformer = (
  transformer: Class<CoreTransformer<unknown, unknown>>,
) => SetMetadata(DECORATOR_CONSTANTS.API_TRANSFORMER, transformer);
