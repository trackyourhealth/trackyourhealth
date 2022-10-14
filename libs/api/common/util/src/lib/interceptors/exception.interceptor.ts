import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Err, Ok } from 'neverthrow';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExceptionInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<T> {
    return next.handle().pipe(
      map((data) => {
        // check if the data we have is an error
        if (data instanceof Err) {
          if (data.isErr()) {
            throw data.error;
          }
        }

        // check if the data is ok
        if (data instanceof Ok) {
          if (data.isOk()) {
            return data.value;
          }
        }

        // it is not an Err nor an Ok class
        // so we will just pass it along
        return data;
      }),
    );
  }
}
