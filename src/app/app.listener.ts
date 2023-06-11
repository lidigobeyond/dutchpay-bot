import { AppService } from './app.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DUTCH_PAY_CREATED_EVENT, PARTICIPANT_PAID_BACK_EVENT } from './app.constant';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppListener {
  constructor(private readonly appService: AppService) {}

  /**
   * 더치 페이 생성 이벤트를 처리합니다.
   * @param dutchPayId
   */
  @OnEvent(DUTCH_PAY_CREATED_EVENT, { async: true })
  async handleDutchPayCreated(dutchPayId: number): Promise<void> {
    return this.appService.handleDutchPayCreated(dutchPayId);
  }

  /**
   * 입금 완료 이벤트를 처리합니다.
   * @param participantId
   */
  @OnEvent(PARTICIPANT_PAID_BACK_EVENT, { async: true })
  async handleParticipantPaidBack(participantId: number): Promise<void> {
    return this.appService.handleParticipantPaidBack(participantId);
  }
}
