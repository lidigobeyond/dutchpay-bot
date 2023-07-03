import { Module } from '@nestjs/common';
import { DutchPayModalModule } from './dutch-pay-modal/dutch-pay-modal.module';
import { DutchPayController } from './dutch-pay.controller';
import { DutchPayListener } from './dutch-pay.listener';
import { DutchPayService } from './dutch-pay.service';
import { DutchPayRequestMessageModule } from './dutch-pay-request-message/dutch-pay-request-message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../../database/entities/dutch-pay.entity';
import { ParticipantEntity } from '../../database/entities/participant.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { DutchPayCreatedMessageModule } from './dutch-pay-created-message/dutch-pay-created-message.module';
import { DutchPayHomeTabModule } from './dutch-pay-home-tab/dutch-pay-home-tab.module';
import { AuthModule } from './auth/auth.module';
import { SlackModule } from '../../slack/slack.module';

@Module({
  imports: [
    SlackModule,
    TypeOrmModule.forFeature([DutchPayEntity, ParticipantEntity]),
    AuthModule,
    DutchPayHomeTabModule,
    DutchPayModalModule,
    DutchPayRequestMessageModule,
    DutchPayCreatedMessageModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [DutchPayController],
  providers: [DutchPayListener, DutchPayService],
})
export class DutchPayModule {}
