import { Module } from '@nestjs/common';
import { SlackModule } from '../../../slack/slack.module';
import { DutchPayRequestMessageListener } from './dutch-pay-request-message.listener';
import { DutchPayRequestMessageService } from './dutch-pay-request-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participant } from '../../../database/entities/participant.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([Participant])],
  providers: [DutchPayRequestMessageListener, DutchPayRequestMessageService],
})
export class DutchPayRequestMessageModule {}
