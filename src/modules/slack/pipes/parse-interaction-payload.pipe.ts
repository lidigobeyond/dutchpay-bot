import { PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InteractionPayload, InteractionType } from '../types/payloads/interaction-payload';
import { BlockActionsPayload } from '../types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../types/payloads/view-submission-payload';

export class ParseInteractionPayloadPipe implements PipeTransform<string, InteractionPayload> {
  transform(value: any) {
    if (typeof value == 'string') {
      value = JSON.parse(value);
    }

    if (!value.hasOwnProperty('type') || typeof value.type !== 'string') {
      return value;
    }

    switch (value.type) {
      case InteractionType.BLOCK_ACTIONS:
        return plainToInstance(BlockActionsPayload, value);
      case InteractionType.VIEW_SUBMISSION:
        return plainToInstance(ViewSubmissionPayload, value);
      default:
        return;
    }
  }
}
