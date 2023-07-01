import { Module } from '@nestjs/common';
import { DutchPayCreatedMessageListener } from './dutch-pay-created-message.listener';
import { DutchPayCreatedMessageService } from './dutch-pay-created-message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../../database/entities/dutch-pay.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DutchPayEntity])],
  providers: [DutchPayCreatedMessageListener, DutchPayCreatedMessageService],
})
export class DutchPayCreatedMessageModule {}
