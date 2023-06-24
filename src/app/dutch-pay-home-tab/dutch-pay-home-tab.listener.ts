import { Injectable } from '@nestjs/common';
import { DutchPayHomeTabService } from './dutch-pay-home-tab.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BLOCK_ACTION } from '../app.constant';
import { CREATE_DUTCH_PAY_ACTION_ID } from './dutch-pay-home-tab.constant';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';

@Injectable()
export class DutchPayHomeTabListener {
  constructor(private readonly dutchPayHomeTabService: DutchPayHomeTabService) {}

  @OnEvent(`${BLOCK_ACTION}/${CREATE_DUTCH_PAY_ACTION_ID}`, { async: true })
  handleCreateDutchPay(blockActionPayload: BlockActionsPayload) {
    return this.dutchPayHomeTabService.handleCreateDutchPay(blockActionPayload);
  }
}
