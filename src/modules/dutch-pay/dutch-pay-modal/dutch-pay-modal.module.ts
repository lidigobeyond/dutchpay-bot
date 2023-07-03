import { Module } from '@nestjs/common';
import { SlackModule } from '../../../slack/slack.module';
import { DutchPayModalListener } from './dutch-pay-modal.listener';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../../../database/entities/dutch-pay.entity';
import { ParticipantEntity } from '../../../database/entities/participant.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([DutchPayEntity, ParticipantEntity])],
  providers: [DutchPayModalListener, DutchPayModalService],
})
export class DutchPayModalModule {}
