import { SetMetadata } from '@nestjs/common';
import { DECORATOR_CONSTANTS } from '@trackyourhealth/api/core/util';

import { Roles } from './../enums/roles.enum';

export const ApiRoles = (...roles: Roles[]) =>
  SetMetadata(DECORATOR_CONSTANTS.API_ROLE, roles);
