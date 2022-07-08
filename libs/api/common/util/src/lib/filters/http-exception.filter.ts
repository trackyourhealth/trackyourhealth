import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      error: {
        statusCode: status,
        message: exception.message,
        exception: exception.name,
        timestamp: new Date().toISOString(),
        path: request.url,
        request: {
          headers: request.headers,
          params: request.params,
          path: request.path,
          query: request.query,
          url: request.url,
        },
      },
    });
  }
}
