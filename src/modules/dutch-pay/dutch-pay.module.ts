import { Module } from '@nestjs/common';
import { DutchPayService } from './dutch-pay.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from './entities/dutch-pay.entity';
import { ParticipantEntity } from './entities/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DutchPayEntity, ParticipantEntity])],
  providers: [DutchPayService],
  exports: [DutchPayService],
})
export class DutchPayModule {}
