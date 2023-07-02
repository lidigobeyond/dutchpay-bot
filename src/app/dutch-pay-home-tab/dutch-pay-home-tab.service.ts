import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../slack/slack.service';
import { BlockActionsPayload } from '../../slack/types/payloads/block-actions-payload';
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
    const { team, triggerId } = blockActionPayload;

    const dutchPayModal = new DutchPayModal({});

    await this.slackService.openModal({ teamId: team.id, triggerId, modal: dutchPayModal });
  }
}
