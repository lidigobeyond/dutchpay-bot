import { Injectable } from '@nestjs/common';
import { DutchPayModalService } from './dutch-pay-modal.service';
import { OnEvent } from '@nestjs/event-emitter';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../modules/slack/types/payloads/view-submission-payload';

@Injectable()
export class DutchPayModalListener {
  constructor(private readonly dutchPayModalService: DutchPayModalService) {}

  @OnEvent('user-selected', { async: true })
  async handleUserSelected(blockActionsPayload: BlockActionsPayload) {
    return this.dutchPayModalService.handleUserSelected(blockActionsPayload);
  }

  @OnEvent('dutch-pay-modal-view', { async: true })
  async handleViewSubmission(viewSubmissionPayload: ViewSubmissionPayload): Promise<void> {
    return this.dutchPayModalService.handleViewSubmission(viewSubmissionPayload);
  }
}
