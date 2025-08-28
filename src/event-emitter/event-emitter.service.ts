import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventNameToEventPayloadMap } from './event-emitter.model';

@Injectable()
export class CustomEventEmitter {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  /**
   * 이벤트를 발행합니다.
   * @param event
   * @param payload
   */
  emit<T extends keyof EventNameToEventPayloadMap, K extends EventNameToEventPayloadMap[T]>(event: T, payload: K): boolean {
    return this.eventEmitter.emit(event as string, payload);
  }
}
