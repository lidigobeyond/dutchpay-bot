import { Injectable } from '@nestjs/common';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BLOCK_ACTION, VIEW_SUBMISSION } from '../app.constant';
import { DUTCH_PAY_MODAL_EXTERNAL_ID, USER_SELECTED_ACTION_ID } from './dutch-pay.constant';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../modules/slack/types/payloads/view-submission-payload';

@Injectable()
export class DutchPayModalListener {
  constructor(private readonly dutchPayModalService: DutchPayModalService) {}

  @OnEvent(`${BLOCK_ACTION}/${USER_SELECTED_ACTION_ID}`, { async: true })
  async handleUserSelected(blockActionsPayload: BlockActionsPayload) {
    return this.dutchPayModalService.handleUserSelected(blockActionsPayload);
  }

  @OnEvent(`${VIEW_SUBMISSION}/${DUTCH_PAY_MODAL_EXTERNAL_ID}`, { async: true })
  async handleViewSubmission(viewSubmissionPayload: ViewSubmissionPayload): Promise<void> {
    return this.dutchPayModalService.handleViewSubmission(viewSubmissionPayload);
  }
}
