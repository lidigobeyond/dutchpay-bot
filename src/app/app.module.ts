import { Module } from '@nestjs/common';
import { CustomConfigModule } from '../config/custom-config.module';
import { CustomEventEmitterModule } from '../event-emitter/event-emitter.module';
import { DatabaseModule } from '../database/database.module';
import { DutchPayModalModule } from './dutch-pay-modal/dutch-pay-modal.module';
import { DutchPayModule } from '../modules/dutch-pay/dutch-pay.module';
import { AppController } from './app.controller';
import { AppListener } from './app.listener';
import { AppService } from './app.service';

@Module({
  imports: [CustomConfigModule, CustomEventEmitterModule, DatabaseModule, DutchPayModalModule, DutchPayModule],
  controllers: [AppController],
  providers: [AppListener, AppService],
})
export class AppModule {}
