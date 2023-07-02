import { PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EventPayload } from '../types/payloads/event-payload';
import { UrlVerifiedEventPayload } from '../types/payloads/url-verified-event-payload';
import { EventType } from '../types/events/event';

export class ParseEventPayloadPipe implements PipeTransform<string, UrlVerifiedEventPayload | EventPayload> {
  transform(value: any) {
    if (typeof value == 'string') {
      value = JSON.parse(value);
    }

    if (value.hasOwnProperty('type') && value.type == EventType.URL_VERIFIED) {
      return plainToInstance(UrlVerifiedEventPayload, value);
    }

    return plainToInstance(EventPayload, value);
  }
}
