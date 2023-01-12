import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SLACK_CONFIG } from './slack.constant';
import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import { SlackConfig } from './slack.module';
import { IModal } from './interfaces/modal.interface';
import { IMessage } from './interfaces/message.interface';

@Injectable()
export class SlackService {
  private readonly webClient: WebClient;

  constructor(@Inject(SLACK_CONFIG) private readonly config: SlackConfig) {
    const { token } = config;

    this.webClient = new WebClient(token);
  }

  /**
   * 사용자에게 모달을 엽니다.
   * 참고 : https://api.slack.com/methods/views.open
   * @param triggerId
   * @param modal
   */
  openModal(triggerId: string, modal: IModal): Promise<WebAPICallResult> {
    return this.webClient.views.open({ trigger_id: triggerId, view: modal.toModalView() });
  }

  /**
   * 사용자가 보고 있는 모달을 업데이트합니다.
   * 참고 : https://api.slack.com/methods/views.update
   * @param viewId
   * @param modal
   */
  updateModal(viewId: string, modal: IModal): Promise<WebAPICallResult> {
    return this.webClient.views.update({ view_id: viewId, view: modal.toModalView() });
  }

  /**
   * 채널(또는 DM)에 메시지를 게시합니다.
   * 참고 : https://api.slack.com/methods/chat.postMessage
   */
  postMessage(args: { channelId: string; message: IMessage; summary: string }): Promise<WebAPICallResult> {
    const { channelId, message, summary } = args;

    return this.webClient.chat.postMessage({
      channel: channelId,
      blocks: message.toBlocks(),
      text: summary,
    });
  }
}
