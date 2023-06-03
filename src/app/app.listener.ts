import { AppService } from './app.service';
import { OnEvent } from '@nestjs/event-emitter';
import { DUTCH_PAY_CREATED_EVENT } from './app.constant';
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
    // 더치 페이 참가자들에게 더치 페이 요청 메시지 발송
    await this.appService.sendDutchPayRequestMessage(dutchPayId);
    // 더치 페이를 생성한 유저에게 생성 완료 메시지 발송
    await this.appService.sendDutchPayCreatedMessage(dutchPayId);
  }
}
