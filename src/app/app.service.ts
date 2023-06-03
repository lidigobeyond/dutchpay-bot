import { Injectable } from '@nestjs/common';
import { DutchPayModal } from './dutch-pay-modal/dto/dutch-pay-modal.dto';
import { SlackService } from '../modules/slack/slack.service';
import { DutchPayCreatedMessage } from './dutch-pay-created-message/dto/dutch-pay-created-message.dto';
import dayjs from 'dayjs';
import { DutchPayService } from '../modules/dutch-pay/dutch-pay.service';
import { DutchPayRequestMessage } from './dutch-pay-request-message/dto/dutch-pay-request-message.dto';

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
   * 더치 페이 참여자들에게 더치 페이 요청 메시지를 보냅니다.
   * @param dutchPayId
   */
  async sendDutchPayRequestMessage(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPayEntity = await this.dutchPayService.get(dutchPayId);

    if (!dutchPayEntity) {
      // TODO: 예외 처리
      throw new Error();
    }

    const { createUserId, title, date, description } = dutchPayEntity;

    for (let i = 0; i < dutchPayEntity.participants.length; i++) {
      const { userId: participantId, price, isPayBack } = dutchPayEntity.participants[i];

      // 더치 페이 요청 메시지 발송
      const response = await this.slackService.postMessage({
        channelId: participantId,
        summary: `<@${createUserId}> 님께서 더치 페이를 요청하셨습니다.`,
        message: new DutchPayRequestMessage({
          createUserId,
          title,
          date: dayjs(date),
          description,
          price,
          isPayBack,
        }),
      });

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }

      // 더치 페이 요청 메시지 타임스탬프 저장
      dutchPayEntity.participants[i].ts = response.ts as string;
    }

    await this.dutchPayService.update(dutchPayEntity);
  }

  /**
   * 더치 페이를 생성한 유저에게 더치 페이 생성 완료 메시지를 보냅니다.
   * @param dutchPayId
   */
  async sendDutchPayCreatedMessage(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPayEntity = await this.dutchPayService.get(dutchPayId);

    if (!dutchPayEntity) {
      // TODO: 예외 처리
      throw new Error();
    }

    const { createUserId, title, date, description, participants } = dutchPayEntity;

    // 더치 페이 생성 완료 메시지 발송
    const response = await this.slackService.postMessage({
      channelId: createUserId,
      summary: '더치 페이가 생성되었습니다.',
      message: new DutchPayCreatedMessage({
        title,
        date: dayjs(date),
        description,
        participants,
      }),
    });

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 더치 페이 생성 완료 메시지 타임스탬프 저장
    dutchPayEntity.ts = response.ts as string;
    await this.dutchPayService.update(dutchPayEntity);
  }
}
