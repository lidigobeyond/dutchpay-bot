import { Module } from '@nestjs/common';
import { SlackModule } from './modules/slack/slack.module';
import { DutchPayModule } from './modules/dutch-pay/dutch-pay.module';

@Module({
  imports: [SlackModule, DutchPayModule],
})
export class AppModule {}
