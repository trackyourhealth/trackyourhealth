// TODO: this pipe fails for GET Requests!

import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class TrimPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isObj(obj: any): boolean {
    return typeof obj === 'object' && obj !== null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private trim(values: any) {
    Object.keys(values).forEach((key) => {
      if (key !== 'password') {
        if (this.isObj(values[key])) {
          values[key] = this.trim(values[key]);
        } else {
          if (typeof values[key] === 'string') {
            values[key] = values[key].trim();
          }
        }
      }
    });
    return values;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(values: any, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (this.isObj(values) && type === 'body') {
      return this.trim(values);
    }

    throw new BadRequestException('Validation failed');
  }
}
