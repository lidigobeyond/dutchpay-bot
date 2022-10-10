import { Module } from '@nestjs/common';
import { DutchPayController } from './dutch-pay.controller';

@Module({
  controllers: [DutchPayController],
})
export class DutchPayModule {}
