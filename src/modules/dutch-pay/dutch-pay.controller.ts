import { Body, Controller, Post } from '@nestjs/common';
import { SlashCommandPayload } from '../slack/dto/payloads/slash-command.payload';
import { ClassTransformPipe } from '../../common/pipes/class-transform.pipe';
import { SlackService } from '../slack/slack.service';
import { DutchPayModal } from './dto/dutch-pay.modal.dto';

@Controller('dutch-pay')
export class DutchPayController {
  constructor(private readonly slackService: SlackService) {}

  @Post('slash-command-was-invoked')
  async slashCommandWasInvoked(@Body(ClassTransformPipe) slashCommandPayload: SlashCommandPayload): Promise<void> {
    const { triggerId, text: title } = slashCommandPayload;

    await this.slackService.openModal(triggerId, new DutchPayModal(title));
  }
}
