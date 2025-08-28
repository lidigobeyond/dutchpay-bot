import { Injectable } from '@nestjs/common';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';
import { BLOCK_ACTION } from '../dutch-pay.constant';
import { CREATE_DUTCH_PAY_ACTION_ID } from './dutch-pay-home-tab.constant';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';
import { CustomOnEvent } from '../../../event-emitter/event-emitter.decorator';

@Injectable()
export class DutchPayHomeTabListener {
  constructor(private readonly dutchPayHomeTabService: DutchPayHomeTabService) {}

  @CustomOnEvent(`${BLOCK_ACTION}/${CREATE_DUTCH_PAY_ACTION_ID}`, { async: true })
  handleCreateDutchPayEvent(blockActionPayload: BlockActionsPayload) {
    return this.dutchPayHomeTabService.handleCreateDutchPayEvent(blockActionPayload);
  }
}
