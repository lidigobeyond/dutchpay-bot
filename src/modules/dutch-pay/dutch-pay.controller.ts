import { Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackService } from '../slack/slack.service';
import { PlainTextElement } from '../slack/dto/plain-text-element.dto';
import { ModalView } from '../slack/dto/modal.view.dto';

@Controller('dutch-pay')
export class DutchPayController {
  constructor(private readonly slackService: SlackService) {}

  @Post()
  start(@Req() req: Request, @Res() res: Response): void {
    const triggerId = req.body['trigger_id'];

    this.slackService.openView(
      triggerId,
      new ModalView(new PlainTextElement('Hello World~!'), []),
    );
  }
}
