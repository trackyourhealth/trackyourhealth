import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import { Request } from 'express';

@Injectable()
export class KratosGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest() as Request;

    const kratos = new V0alpha2Api(
      new Configuration({ basePath: 'http://kratos:4433/' }),
    );

    try {
      const result = await kratos.toSession(request.header('X-Session-Token'));

      // `whoami` returns the session or an error. We're changing the type here
      // because express-session is not detected by TypeScript automatically.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (request as Request & { user: any }).user = result.data;
      return true;
    } catch {
      console.log('it failed');
      return false;
    }
  }
}
