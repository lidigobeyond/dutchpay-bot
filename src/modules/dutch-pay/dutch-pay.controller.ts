import { Body, Controller, Post } from '@nestjs/common';
import { SlashCommandPayload } from '../slack/dto/payloads/slash-command.payload';
import { ClassTransformPipe } from '../../common/pipes/class-transform.pipe';
import { SlackService } from '../slack/slack.service';
import { DutchPayModal } from './dto/dutch-pay.modal.dto';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { BlockActionsPayload } from '../slack/dto/payloads/block-actions.payload';

@Controller('dutch-pay')
export class DutchPayController {
  constructor(private readonly slackService: SlackService, private readonly eventEmitter: EventEmitter2) {}

  @Post('interaction-component-was-used')
  interactionComponentWasUsed(@Body('payload', ClassTransformPipe) blockActionsPayload: BlockActionsPayload): void {
    const { actions } = blockActionsPayload;

    this.eventEmitter.emit(actions[0].actionId, blockActionsPayload);
  }

  @OnEvent('user-select')
  async userSelected(blockActionsPayload: BlockActionsPayload): Promise<void> {
    const { view, actions } = blockActionsPayload;

    if (!view) {
      // FIXME 예외 처리
      return;
    }

    const { id: viewId, state } = view;

    const dutchPayModal = DutchPayModal.fromState(state);

    const selectedUserId = (actions[0] as any).selected_user;

    dutchPayModal.addParticipant({ id: selectedUserId });

    await this.slackService.updateModal(viewId, dutchPayModal);
  }

  @Post('slash-command-was-invoked')
  async slashCommandWasInvoked(@Body(ClassTransformPipe) slashCommandPayload: SlashCommandPayload): Promise<void> {
    const { triggerId, text: title } = slashCommandPayload;

    await this.slackService.openModal(triggerId, new DutchPayModal({ title }));
  }
}
