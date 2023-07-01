import { Module } from '@nestjs/common';
import { CustomConfigModule } from '../config/custom-config.module';
import { CustomEventEmitterModule } from '../event-emitter/event-emitter.module';
import { SlackModule } from '../modules/slack/slack.module';
import { DatabaseModule } from '../database/database.module';
import { DutchPayModalModule } from './dutch-pay-modal/dutch-pay-modal.module';
import { AppController } from './app.controller';
import { AppListener } from './app.listener';
import { AppService } from './app.service';
import { DutchPayRequestMessageModule } from './dutch-pay-request-message/dutch-pay-request-message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../database/entities/dutch-pay.entity';
import { ParticipantEntity } from '../database/entities/participant.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { DutchPayCreatedMessageModule } from './dutch-pay-created-message/dutch-pay-created-message.module';
import { DutchPayHomeTabModule } from './dutch-pay-home-tab/dutch-pay-home-tab.module';

@Module({
  imports: [
    CustomConfigModule,
    CustomEventEmitterModule,
    SlackModule,
    DatabaseModule,
    TypeOrmModule.forFeature([DutchPayEntity, ParticipantEntity]),
    ScheduleModule.forRoot(),
    DutchPayModalModule,
    DutchPayRequestMessageModule,
    DutchPayCreatedMessageModule,
    DutchPayHomeTabModule,
  ],
  controllers: [AppController],
  providers: [AppListener, AppService],
})
export class AppModule {}
