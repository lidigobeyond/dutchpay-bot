import { Injectable } from '@nestjs/common';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { BLOCK_ACTION, VIEW_SUBMISSION } from '../dutch-pay.constant';
import { DUTCH_PAY_MODAL_EXTERNAL_ID, USER_SELECTED_ACTION_ID } from './dutch-pay.constant';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../../slack/types/payloads/view-submission-payload';
import { CustomOnEvent } from '../../../event-emitter/event-emitter.decorator';

@Injectable()
export class DutchPayModalListener {
  constructor(private readonly dutchPayModalService: DutchPayModalService) {}

  @CustomOnEvent(`${BLOCK_ACTION}/${USER_SELECTED_ACTION_ID}`, { async: true })
  async handleUserSelectedEvent(blockActionsPayload: BlockActionsPayload) {
    return this.dutchPayModalService.handleUserSelectedEvent(blockActionsPayload);
  }

  @CustomOnEvent(`${VIEW_SUBMISSION}/${DUTCH_PAY_MODAL_EXTERNAL_ID}/*`, { async: true })
  async handleViewSubmissionEvent(viewSubmissionPayload: ViewSubmissionPayload): Promise<void> {
    return this.dutchPayModalService.handleViewSubmissionEvent(viewSubmissionPayload);
  }
}
