import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../modules/slack/slack.service';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { DutchPayModal } from '../dutch-pay-modal/dto/dutch-pay-modal.dto';

@Injectable()
export class DutchPayHomeTabService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private readonly slackService: SlackService) {}

  /**
   * 더치 페이 생성 요청 이벤트 처리 함수
   * @param blockActionPayload
   */
  async handleCreateDutchPay(blockActionPayload: BlockActionsPayload): Promise<void> {
    const { triggerId } = blockActionPayload;

    const dutchPayModal = new DutchPayModal({});

    await this.slackService.openModal(triggerId, dutchPayModal);
  }
}
