import { Body, Controller, Post } from '@nestjs/common';
import { SlashCommandPayload } from '../slack/dto/payloads/slash-command.payload';
import { ClassTransformPipe } from '../../common/pipes/class-transform.pipe';
import { DutchPayService } from './dutch-pay.service';

@Controller('dutch-pay')
export class DutchPayController {
  constructor(private readonly dutchPayService: DutchPayService) {}

  @Post('slash-command-was-invoked')
  slashCommandWasInvoked(@Body(ClassTransformPipe) slashCommandPayload: SlashCommandPayload): Promise<void> {
    const { triggerId, text: title } = slashCommandPayload;

    return this.dutchPayService.openNewDutchPayModal(triggerId, title);
  }
}
