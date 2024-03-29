import { Injectable } from '@nestjs/common';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BLOCK_ACTION } from '../dutch-pay.constant';
import { CREATE_DUTCH_PAY_ACTION_ID } from './dutch-pay-home-tab.constant';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';

@Injectable()
export class DutchPayHomeTabListener {
  constructor(private readonly dutchPayHomeTabService: DutchPayHomeTabService) {}

  @OnEvent(`${BLOCK_ACTION}/${CREATE_DUTCH_PAY_ACTION_ID}`, { async: true })
  handleCreateDutchPayEvent(blockActionPayload: BlockActionsPayload) {
    return this.dutchPayHomeTabService.handleCreateDutchPayEvent(blockActionPayload);
  }
}
