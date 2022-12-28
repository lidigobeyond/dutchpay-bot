import { PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { InteractionPayload, InteractionType } from '../dto/payloads/interaction-payload.dto';
import { BlockActionsPayload } from '../dto/payloads/block-actions-payload.dto';

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
      default:
        return;
    }
  }
}
