import { Body, Controller, Post } from '@nestjs/common';
import { ClassTransformPipe } from '../common/pipes/class-transform.pipe';
import { SlashCommandPayload } from '../modules/slack/types/payloads/slash-command-payload';
import { ParseInteractionPayloadPipe } from '../modules/slack/pipes/parse-interaction-payload.pipe';
import { InteractionPayload } from '../modules/slack/types/payloads/interaction-payload';
import { BlockActionsPayload } from '../modules/slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../modules/slack/types/payloads/view-submission-payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppService } from './app.service';
import { BLOCK_ACTION, VIEW_SUBMISSION } from './app.constant';

@Controller('dutch-pay-app')
export class AppController {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly appService: AppService) {}

  @Post('slash-command-was-invoked')
  async handleSlashCommand(@Body(ClassTransformPipe) payload: SlashCommandPayload): Promise<void> {
    const { triggerId, text: title } = payload;

    return this.appService.openNewDutchPayModal({ triggerId, title });
  }

  @Post('interaction-occurred')
  handleInteraction(@Body('payload', ParseInteractionPayloadPipe) payload: InteractionPayload) {
    if (payload instanceof BlockActionsPayload) {
      return this.handleBlockActions(payload);
    }
    if (payload instanceof ViewSubmissionPayload) {
      return this.handleViewSubmission(payload);
    }
  }

  handleBlockActions(payload: BlockActionsPayload) {
    const { actions } = payload;

    const ACTION_ID = actions[0].actionId;

    this.eventEmitter.emit(`${BLOCK_ACTION}/${ACTION_ID}`, payload);
  }

  handleViewSubmission(payload: ViewSubmissionPayload) {
    const { view } = payload;

    const VIEW_EXTERNAL_ID = view.external_id;

    this.eventEmitter.emit(`${VIEW_SUBMISSION}/${VIEW_EXTERNAL_ID}`, payload);
  }
}
