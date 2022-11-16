import { Module } from '@nestjs/common';
import { DutchPayController } from './dutch-pay.controller';
import { DutchPayService } from './dutch-pay.service';

@Module({
  controllers: [DutchPayController],
  providers: [DutchPayService],
})
export class DutchPayModule {}
