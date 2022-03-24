import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ApiAuthGuard extends AuthGuard('jwt') {
  override handleRequest(err: any, user: any, info: Error) {
    if (err || info || !user) {
      throw new UnauthorizedException(err || info);
    }

    return user;
  }
}
