import { Module } from '@nestjs/common';
import { CustomConfigModule } from '../config/custom-config.module';
import { CustomEventEmitterModule } from '../event-emitter/event-emitter.module';
import { DatabaseModule } from '../database/database.module';
import { DutchPayModalModule } from './dutch-pay-modal/dutch-pay-modal.module';
import { AppController } from './app.controller';
import { AppListener } from './app.listener';
import { AppService } from './app.service';
import { DutchPayRequestMessageModule } from './dutch-pay-request-message/dutch-pay-request-message.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DutchPayEntity } from '../modules/dutch-pay/entities/dutch-pay.entity';
import { ParticipantEntity } from '../modules/dutch-pay/entities/participant.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CustomConfigModule,
    CustomEventEmitterModule,
    DatabaseModule,
    ScheduleModule.forRoot(),
    DutchPayModalModule,
    DutchPayRequestMessageModule,
    TypeOrmModule.forFeature([DutchPayEntity, ParticipantEntity]),
  ],
  controllers: [AppController],
  providers: [AppListener, AppService],
})
export class AppModule {}
