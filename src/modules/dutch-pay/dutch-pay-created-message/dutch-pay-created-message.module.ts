import { Module } from '@nestjs/common';
import { SlackModule } from '../../../slack/slack.module';
import { DutchPayCreatedMessageListener } from './dutch-pay-created-message.listener';
import { DutchPayCreatedMessageService } from './dutch-pay-created-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dutchpay } from '../../../database/entities/dutchpay.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([Dutchpay])],
  providers: [DutchPayCreatedMessageListener, DutchPayCreatedMessageService],
})
export class DutchPayCreatedMessageModule {}
