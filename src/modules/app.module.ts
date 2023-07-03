import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DutchPayModule } from './dutch-pay/dutch-pay.module';
import { CustomEventEmitterModule } from '../event-emitter/event-emitter.module';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [CustomEventEmitterModule, DatabaseModule, DutchPayModule],
  controllers: [AppController],
})
export class AppModule {}
