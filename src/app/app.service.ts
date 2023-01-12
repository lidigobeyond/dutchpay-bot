import { Injectable } from '@nestjs/common';
import { DutchPayModal } from './dutch-pay-modal/dto/dutch-pay-modal.dto';
import { SlackService } from '../modules/slack/slack.service';
import { DutchPayCreatedMessage } from './dutch-pay-created-message/dto/dutch-pay-created-message.dto';
import dayjs from 'dayjs';
import { DutchPayService } from '../modules/dutch-pay/dutch-pay.service';

@Injectable()
export class AppService {
  constructor(private readonly slackService: SlackService, private readonly dutchPayService: DutchPayService) {}

  /**
   * 사용자에게 새로운 더치 페이 생성 모달을 엽니다.
   * @param args
   */
  async openNewDutchPayModal(args: { triggerId: string; title?: string }): Promise<void> {
    const { triggerId, title } = args;

    const dutchPayModal = new DutchPayModal({ title });

    await this.slackService.openModal(triggerId, dutchPayModal);
  }

  /**
   * 더치 페이를 생성한 유저에게 더치 페이 생성 완료 메시지를 보냅니다.
   * @param dutchPayId
   */
  async sendDutchPayCreatedMessage(dutchPayId: number): Promise<void> {
    const dutchPayEntity = await this.dutchPayService.get(dutchPayId);
    if (!dutchPayEntity) {
      // TODO: 예외 처리
      throw new Error();
    }

    const { createUserId, title, date, description, participants } = dutchPayEntity;

    const dutchPayCreatedMessage = new DutchPayCreatedMessage({
      title,
      date: dayjs(date),
      description,
      participants,
    });

    await this.slackService.postMessage({
      channelId: createUserId,
      message: dutchPayCreatedMessage,
      summary: '더치 페이가 생성되었습니다.',
    });
  }
}
