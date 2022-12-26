import { Module } from '@nestjs/common';
import { SlackModule } from './modules/slack/slack.module';
import { DutchPayModule } from './modules/dutch-pay/dutch-pay.module';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), EventEmitterModule.forRoot({ global: true }), SlackModule, DutchPayModule],
})
export class AppModule {}
