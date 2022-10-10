import { Inject, Injectable } from '@nestjs/common';
import { ModalView, WebClient } from '@slack/web-api';
import { SLACK_CONFIG } from './slack.constant';
import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import { SlackConfig } from './slack.module';

@Injectable()
export class SlackService {
  private readonly webClient: WebClient;

  constructor(@Inject(SLACK_CONFIG) private readonly config: SlackConfig) {
    const { token } = config;

    this.webClient = new WebClient(token);
  }

  /**
   * 사용자에게 모달을 엽니다.
   */
  openView(triggerId: string, view: ModalView): Promise<WebAPICallResult> {
    return this.webClient.views.open({ trigger_id: triggerId, view });
  }
}
