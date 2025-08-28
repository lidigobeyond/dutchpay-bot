import { EventNameToEventPayloadMap } from './event-emitter.model';
import { OnEventOptions } from '@nestjs/event-emitter/dist/interfaces';
import { OnEvent } from '@nestjs/event-emitter';

export const CustomOnEvent = <T extends keyof EventNameToEventPayloadMap, K extends EventNameToEventPayloadMap[T]>(
  event: T,
  options?: OnEventOptions,
) => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<(payload: K) => any>) {
    return OnEvent(event as string, options)(target, propertyKey, descriptor);
  };
};
