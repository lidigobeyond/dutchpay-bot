import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

export class ClassTransformPipe implements PipeTransform<any> {
  transform(value: any, { metatype }: ArgumentMetadata) {
    if (metatype === undefined) {
      return value;
    }

    if (typeof value !== 'object') {
      value = JSON.parse(value);
    }

    return plainToInstance(metatype, value);
  }
}
