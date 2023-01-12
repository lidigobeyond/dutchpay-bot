import { PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InteractionPayload, InteractionType } from '../types/payloads/interaction-payload';
import { BlockActionsPayload } from '../types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../types/payloads/view-submission-payload';

export class ParseInteractionPayloadPipe implements PipeTransform<string, InteractionPayload> {
  transform(value: any) {
    if (typeof value !== 'string') {
      return value;
    }

    const obj = JSON.parse(value);

    if (!obj.hasOwnProperty('type') || typeof obj.type !== 'string') {
      return value;
    }

    switch (obj.type) {
      case InteractionType.BLOCK_ACTIONS:
        return plainToInstance(BlockActionsPayload, obj);
      case InteractionType.VIEW_SUBMISSION:
        return plainToInstance(ViewSubmissionPayload, obj);
      default:
        return;
    }
  }
}
