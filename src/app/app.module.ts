import { Module } from '@nestjs/common';
import { CustomConfigModule } from '../config/custom-config.module';
import { DatabaseModule } from '../database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DutchPayModalModule } from './dutch-pay-modal/dutch-pay-modal.module';
import { AppController } from './app.controller';
import { AppListener } from './app.listener';
import { AppService } from './app.service';
import { DutchPayModule } from '../modules/dutch-pay/dutch-pay.module';

@Module({
  imports: [CustomConfigModule, DatabaseModule, EventEmitterModule.forRoot({ global: true }), DutchPayModalModule, DutchPayModule],
  controllers: [AppController],
  providers: [AppListener, AppService],
})
export class AppModule {}
