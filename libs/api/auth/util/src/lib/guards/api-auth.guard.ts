import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApiAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err: never, user: never, info: Error) {
    if (err || info || !user) {
      throw new UnauthorizedException(err || info);
    }

    return user;
  }
}
