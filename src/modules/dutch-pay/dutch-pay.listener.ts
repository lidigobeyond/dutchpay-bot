import { DutchPayService } from './dutch-pay.service';
import { DUTCH_PAY_CREATED_EVENT, DUTCH_PAY_DELETED_EVENT, PARTICIPANT_PAID_BACK_EVENT } from './dutch-pay.constant';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CustomOnEvent } from '../../event-emitter/event-emitter.decorator';

@Injectable()
export class DutchPayListener {
  constructor(private readonly dutchPayService: DutchPayService) {}

  @CustomOnEvent(DUTCH_PAY_CREATED_EVENT, { async: true })
  handleDutchPayCreatedEvent(dutchPayId: number): Promise<void> {
    return this.dutchPayService.handleDutchPayCreatedEvent(dutchPayId);
  }

  @CustomOnEvent(PARTICIPANT_PAID_BACK_EVENT, { async: true })
  handleParticipantPaidBackEvent(participantId: number): Promise<void> {
    return this.dutchPayService.handleParticipantPaidBackEvent(participantId);
  }

  @CustomOnEvent(DUTCH_PAY_DELETED_EVENT, { async: true })
  handleDutchPayDeletedEvent(dutchPayId: number): Promise<void> {
    return this.dutchPayService.handleDutchPayDeletedEvent(dutchPayId);
  }

  /**
   * 평일(월~금) 9시 55분, 12시 55분, 18시 55분에 입금 완료하지 않은 더치페이 참여자에게 리마인드 메시지를 보냅니다.
   */
  @Cron('0 55 9,12,18 * * 1-5')
  sendRemindMessage() {
    return this.dutchPayService.sendRemindMessage();
  }
}
