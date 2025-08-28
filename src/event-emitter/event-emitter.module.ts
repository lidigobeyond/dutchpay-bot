import { Global, Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CustomEventEmitter } from './event-emitter.service';

@Global()
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '/',
    }),
  ],
  providers: [CustomEventEmitter],
  exports: [CustomEventEmitter],
})
export class CustomEventEmitterModule {}
