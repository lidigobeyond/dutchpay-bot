import { Module } from '@nestjs/common';
import { DutchPayHomeTabListener } from './dutch-pay-home-tab.listener';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';

@Module({
  providers: [DutchPayHomeTabListener, DutchPayHomeTabService],
})
export class DutchPayHomeTabModule {}
