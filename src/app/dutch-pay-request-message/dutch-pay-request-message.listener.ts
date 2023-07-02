import { Injectable } from '@nestjs/common';
import { DutchPayRequestMessageService } from './dutch-pay-request-message.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BLOCK_ACTION } from '../app.constant';
import { PAID_BACK_ACTION_ID } from './dutch-pay-request-message.constant';
import { BlockActionsPayload } from '../../slack/types/payloads/block-actions-payload';

@Injectable()
export class DutchPayRequestMessageListener {
  constructor(private readonly dutchPayRequestMessageService: DutchPayRequestMessageService) {}

  @OnEvent(`${BLOCK_ACTION}/${PAID_BACK_ACTION_ID}`, { async: true })
  handlePaidBack(blockActionPayload: BlockActionsPayload) {
    return this.dutchPayRequestMessageService.handlePaidBack(blockActionPayload);
  }
}
