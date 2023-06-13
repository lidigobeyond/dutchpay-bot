import { AppService } from './app.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DUTCH_PAY_CREATED_EVENT, PARTICIPANT_PAID_BACK_EVENT } from './app.constant';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class AppListener {
  constructor(private readonly appService: AppService) {}

  /**
   * 더치 페이 생성 이벤트를 처리합니다.
   * @param dutchPayId
   */
  @OnEvent(DUTCH_PAY_CREATED_EVENT, { async: true })
  handleDutchPayCreated(dutchPayId: number): Promise<void> {
    return this.appService.handleDutchPayCreated(dutchPayId);
  }

  /**
   * 입금 완료 이벤트를 처리합니다.
   * @param participantId
   */
  @OnEvent(PARTICIPANT_PAID_BACK_EVENT, { async: true })
  handleParticipantPaidBack(participantId: number): Promise<void> {
    return this.appService.handleParticipantPaidBack(participantId);
  }

  /**
   * 평일(월~금) 8시 55분, 11시 55분, 17시 55분에 입금 완료하지 않은 더치 페이 참여자에게 리마인드 메시지를 보냅니다.
   */
  @Cron('0 55 8,11,17 * * 1-5')
  sendRemindMessage() {
    return this.appService.sendRemindMessage();
  }
}
