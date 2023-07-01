import { Module } from '@nestjs/common';
import { SlackModule } from '../../modules/slack/slack.module';
import { DutchPayCreatedMessageListener } from './dutch-pay-created-message.listener';
import { DutchPayCreatedMessageService } from './dutch-pay-created-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../../database/entities/dutch-pay.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([DutchPayEntity])],
  providers: [DutchPayCreatedMessageListener, DutchPayCreatedMessageService],
})
export class DutchPayCreatedMessageModule {}
