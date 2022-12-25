import { Injectable } from '@nestjs/common';
import { SlackService } from '../slack/slack.service';
import { DutchPayModal } from '../slack/dto/modals/dutch-pay.modal.dto';

@Injectable()
export class DutchPayService {
  constructor(private readonly slackService: SlackService) {}

  async openNewDutchPayModal(triggerId: string, title?: string): Promise<void> {
    await this.slackService.openModal(triggerId, new DutchPayModal(title));
  }
}
