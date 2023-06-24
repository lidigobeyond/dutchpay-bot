import { Inject, Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { SLACK_CONFIG } from './slack.constant';
import { WebAPICallResult } from '@slack/web-api/dist/WebClient';
import { SlackConfig } from './slack.module';
import { IModal } from './interfaces/modal.interface';
import { IHome } from './interfaces/home.interface';
import { IMessage } from './interfaces/message.interface';
import { ChatPostMessageResponse } from '@slack/web-api/dist/response/ChatPostMessageResponse';
import { ChatUpdateResponse } from '@slack/web-api/dist/response/ChatUpdateResponse';

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
   * 사용자가 보고 있는 모달을 변경합니다.
   * 참고 : https://api.slack.com/methods/views.update
   * @param viewId
   * @param modal
   */
  updateModal(viewId: string, modal: IModal): Promise<WebAPICallResult> {
    return this.webClient.views.update({ view_id: viewId, view: modal.toModalView() });
  }

  /**
   * 특정 사용자와 상호작용할 Home 탭을 생성(또는 수정)합니다.
   * 참고 : https://api.slack.com/methods/views.publish
   * @param userId
   * @param home
   */
  publishHome(userId: string, home: IHome): Promise<WebAPICallResult> {
    return this.webClient.views.publish({ user_id: userId, view: home.toHomeView() });
  }

  /**
   * 채널(또는 DM)에 구조적인 메시지를 게시합니다.
   * 참고 : https://api.slack.com/methods/chat.postMessage
   */
  postMessage(args: { channelId: string; message?: IMessage; text: string }): Promise<ChatPostMessageResponse> {
    const { channelId, message, text } = args;

    return this.webClient.chat.postMessage({
      channel: channelId,
      blocks: message?.toBlocks(),
      text,
    });
  }

  /**
   * 발송했던 메시지 내용을 수정합니다.
   * 참고 : https://api.slack.com/methods/chat.update
   * @param args
   */
  updateMessage(args: { channelId: string; ts: string; message?: IMessage; text: string }): Promise<ChatUpdateResponse> {
    const { channelId, ts, message, text } = args;

    return this.webClient.chat.update({
      channel: channelId,
      ts,
      blocks: message?.toBlocks(),
      text: text,
    });
  }

  /**
   * 댓글을 답니다.
   * 참고 : https://api.slack.com/methods/chat.postMessage#threads
   */
  replyMessage(args: { channelId: string; ts: string; message?: IMessage; text: string; broadcast?: boolean }): Promise<ChatPostMessageResponse> {
    const { channelId, ts, message, text, broadcast } = args;

    return this.webClient.chat.postMessage({
      channel: channelId,
      thread_ts: ts,
      blocks: message?.toBlocks(),
      text,
      reply_broadcast: broadcast ?? false,
    });
  }
}
