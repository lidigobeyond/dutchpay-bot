import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class ClassTransformPipe implements PipeTransform<any> {
  transform(value: any, { metatype }: ArgumentMetadata) {
    if (typeof value !== 'object') {
      return value;
    }

    if (metatype === undefined) {
      return value;
    }

    return plainToInstance(metatype, value);
  }
}
