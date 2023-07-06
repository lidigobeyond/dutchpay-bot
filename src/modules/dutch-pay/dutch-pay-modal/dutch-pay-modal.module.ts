import { Module } from '@nestjs/common';
import { SlackModule } from '../../../slack/slack.module';
import { DutchPayModalListener } from './dutch-pay-modal.listener';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dutchpay } from '../../../database/entities/dutchpay.entity';
import { Participant } from '../../../database/entities/participant.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([Dutchpay, Participant])],
  providers: [DutchPayModalListener, DutchPayModalService],
})
export class DutchPayModalModule {}
