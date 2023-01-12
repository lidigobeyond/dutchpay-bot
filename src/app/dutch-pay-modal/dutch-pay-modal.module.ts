import { Module } from '@nestjs/common';
import { SlackModule } from '../../modules/slack/slack.module';
import { DutchPayModalListener } from './dutch-pay-modal.listener';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { DutchPayModule } from '../../modules/dutch-pay/dutch-pay.module';

@Module({
  imports: [SlackModule, DutchPayModule],
  providers: [DutchPayModalListener, DutchPayModalService],
})
export class DutchPayModalModule {}
