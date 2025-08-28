import { Injectable } from '@nestjs/common';
import { DutchPayCreatedMessageService } from './dutch-pay-created-message.service';
import { BLOCK_ACTION } from '../dutch-pay.constant';
import { DELETE_DUTCH_PAY_ACTION_ID } from './dutch-pay-created-message.constant';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';
import { CustomOnEvent } from '../../../event-emitter/event-emitter.decorator';

@Injectable()
export class DutchPayCreatedMessageListener {
  constructor(private readonly dutchPayCreatedMessageService: DutchPayCreatedMessageService) {}

  @CustomOnEvent(`${BLOCK_ACTION}/${DELETE_DUTCH_PAY_ACTION_ID}`, { async: true })
  handleDeleteDutchPayEvent(blockActionPayload: BlockActionsPayload) {
    return this.dutchPayCreatedMessageService.handleDeleteDutchPayEvent(blockActionPayload);
  }
}
