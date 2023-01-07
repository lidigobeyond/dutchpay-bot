import { Body, Controller, Post } from '@nestjs/common';
import { SlashCommandPayload } from '../slack/dto/payloads/slash-command-payload.dto';
import { ClassTransformPipe } from '../../common/pipes/class-transform.pipe';
import { SlackService } from '../slack/slack.service';
import { DutchPayModal } from './dto/dutch-pay-modal.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { ParseInteractionPayloadPipe } from '../slack/pipes/parse-interaction-payload.pipe';
import { BlockActionsPayload } from '../slack/dto/payloads/block-actions-payload.dto';
import { InteractionPayload } from '../slack/dto/payloads/interaction-payload.dto';
import { DutchPayModalState } from './dto/dutch-pay-modal-state.dto';

@Controller('dutch-pay')
export class DutchPayController {
  constructor(private readonly slackService: SlackService, private readonly eventEmitter: EventEmitter2) {}

  @Post('slash-command-was-invoked')
  async handleSlashCommand(@Body(ClassTransformPipe) payload: SlashCommandPayload): Promise<void> {
    const { triggerId, text: title } = payload;

    await this.slackService.openModal(triggerId, new DutchPayModal({ title }));
  }

  @Post('interaction-occurred')
  handleInteraction(@Body('payload', ParseInteractionPayloadPipe) payload: InteractionPayload) {
    if (payload instanceof BlockActionsPayload) {
      return this.handleBlockActions(payload);
    }
  }

  handleBlockActions(payload: BlockActionsPayload) {
    const { actions } = payload;

    this.eventEmitter.emit(actions[0].actionId, payload);
  }

  @OnEvent('user-select')
  async userSelected(blockActionsPayload: BlockActionsPayload): Promise<void> {
    const { view, actions } = blockActionsPayload;

    if (!view) {
      // FIXME 예외 처리
      return;
    }

    const { title, datetime, description, participants } = DutchPayModalState.fromViewState(view.state);

    const selectedUserId = (actions[0] as any).selected_user;

    const isDuplicatedParticipant = participants.some((participant) => participant.id === selectedUserId);
    if (!isDuplicatedParticipant) {
      participants.push({ id: selectedUserId as string });
    }

    const dutchPayModal = new DutchPayModal({
      title,
      datetime,
      description,
      participants,
    });

    await this.slackService.updateModal(view.id, dutchPayModal);
  }
}
