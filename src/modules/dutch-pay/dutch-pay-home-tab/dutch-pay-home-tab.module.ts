import { Module } from '@nestjs/common';
import { SlackModule } from '../../../slack/slack.module';
import { DutchPayHomeTabListener } from './dutch-pay-home-tab.listener';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';

@Module({
  imports: [SlackModule],
  providers: [DutchPayHomeTabListener, DutchPayHomeTabService],
})
export class DutchPayHomeTabModule {}
