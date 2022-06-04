import { Injectable, NestMiddleware } from '@nestjs/common';
import { Configuration, V0alpha2Api } from '@ory/kratos-client';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GuardMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    const kratos = new V0alpha2Api(
      new Configuration({ basePath: 'http://kratos:4433/' }),
    );

    kratos
      .toSession(req.header('X-Session-Token'), undefined)
      .then(({ data: session }) => {
        console.log(session);
        // `whoami` returns the session or an error. We're changing the type here
        // because express-session is not detected by TypeScript automatically.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (req as Request & { user: any }).user = { session };
        next();
      })
      .catch(() => {
        // no session is found - do something appropriate for the user
      });
  }
}
