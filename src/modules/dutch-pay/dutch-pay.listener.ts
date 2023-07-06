import { DutchPayService } from './dutch-pay.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DUTCH_PAY_CREATED_EVENT, DUTCH_PAY_DELETED_EVENT, PARTICIPANT_PAID_BACK_EVENT } from './dutch-pay.constant';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class DutchPayListener {
  constructor(private readonly dutchPayService: DutchPayService) {}

  @OnEvent(DUTCH_PAY_CREATED_EVENT, { async: true })
  handleDutchPayCreatedEvent(dutchPayId: number): Promise<void> {
    return this.dutchPayService.handleDutchPayCreatedEvent(dutchPayId);
  }

  @OnEvent(PARTICIPANT_PAID_BACK_EVENT, { async: true })
  handleParticipantPaidBackEvent(participantId: number): Promise<void> {
    return this.dutchPayService.handleParticipantPaidBackEvent(participantId);
  }

  @OnEvent(DUTCH_PAY_DELETED_EVENT, { async: true })
  handleDutchPayDeletedEvent(dutchPayId: number): Promise<void> {
    return this.dutchPayService.handleDutchPayDeletedEvent(dutchPayId);
  }

  /**
   * 평일(월~금) 9시 55분, 11시 55분, 18시 55분에 입금 완료하지 않은 더치페이 참여자에게 리마인드 메시지를 보냅니다.
   */
  @Cron('0 55 9,11,18 * * 1-5')
  sendRemindMessage() {
    return this.dutchPayService.sendRemindMessage();
  }
}
