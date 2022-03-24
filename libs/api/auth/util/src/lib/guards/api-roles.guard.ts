import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '@prisma/client';
import { DECORATOR_CONSTANTS } from '@trackyourhealth/api/core/util';

@Injectable()
export class ApiRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>(
      DECORATOR_CONSTANTS.API_ROLE,
      context.getHandler(),
    );

    // no role was set -> allow
    if (!roles || roles.length === 0) {
      return true;
    }

    // get the current user
    // this should be ok, because we will call the RoleGuard AFTER the AuthGuard
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) {
      throw new InternalServerErrorException(
        'Cannot extract User Information. Have you already called the AuthGuard?',
      );
    }

    const userRoles = JSON.parse(JSON.stringify(user.roles)) as string[];

    return roles.every((i) => userRoles.includes(i));
  }
}
