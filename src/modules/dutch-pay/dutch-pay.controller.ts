import { Body, Controller, Post } from '@nestjs/common';
import { ClassTransformPipe } from '../../common/pipes/class-transform.pipe';
import { SlashCommandPayload } from '../../slack/types/payloads/slash-command-payload';
import { ParseInteractionPayloadPipe } from '../../slack/pipes/parse-interaction-payload.pipe';
import { InteractionPayload } from '../../slack/types/payloads/interaction-payload';
import { BlockActionsPayload } from '../../slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../slack/types/payloads/view-submission-payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DutchPayService } from './dutch-pay.service';
import { BLOCK_ACTION, VIEW_SUBMISSION } from './dutch-pay.constant';
import { EventPayload } from '../../slack/types/payloads/event-payload';
import { ParseEventPayloadPipe } from '../../slack/pipes/parse-event-payload.pipe';
import { UrlVerifiedEventPayload } from '../../slack/types/payloads/url-verified-event-payload';
import { EventType } from '../../slack/types/events/event';

@Controller('dutch-pay-app')
export class DutchPayController {
  constructor(private readonly eventEmitter: EventEmitter2, private readonly dutchPayService: DutchPayService) {}

  @Post('slash_command_was_invoked')
  async handleSlashCommand(@Body(ClassTransformPipe) payload: SlashCommandPayload): Promise<void> {
    const { teamId, triggerId, text: title } = payload;

    return this.dutchPayService.openNewDutchPayModal({ teamId, triggerId, title });
  }

  @Post('interaction_occurred')
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

  @Post('event_occurred')
  handleEvent(@Body(ParseEventPayloadPipe) payload: UrlVerifiedEventPayload | EventPayload) {
    if (payload instanceof UrlVerifiedEventPayload) {
      return this.handleUrlVerifiedEvent(payload);
    }

    switch (payload.event.type) {
      case EventType.APP_HOME_OPENED:
        return this.handleAppHomeOpenedEvent(payload);
    }
  }

  /**
   * Event API Request URL 유효성 검사 이벤트를 처리합니다.
   * 참고 : https://api.slack.com/apis/connections/events-api#handshake
   * @param payload
   */
  handleUrlVerifiedEvent(payload: UrlVerifiedEventPayload) {
    return payload.challenge;
  }

  /**
   * Home 탭이 열렸을 때 발생하는 이벤트를 처리합니다.
   * 참고 : https://api.slack.com/surfaces/tabs/events#opened
   * @param payload
   */
  handleAppHomeOpenedEvent(payload: EventPayload) {
    const { teamId, event } = payload;
    const { user } = event;

    return this.dutchPayService.openNewHomeTab({ teamId, userId: user });
  }
}