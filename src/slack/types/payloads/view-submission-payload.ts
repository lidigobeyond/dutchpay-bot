import { InteractionPayload } from './interaction-payload';
import { Expose, Type } from 'class-transformer';
import { View } from './block-actions-payload';

export class ResponseUrl {
  @Expose({ name: 'response_url' })
  responseUrl: string;

  @Expose({ name: 'block_id' })
  blockId: string;

  @Expose({ name: 'action_id' })
  actionId: string;

  @Expose({ name: 'channel_id' })
  channelId: string;
}

/**
 * 참고 : https://api.slack.com/reference/interaction-payloads/views#view_submission
 */
export class ViewSubmissionPayload extends InteractionPayload {
  /**
   * The source view containing clicked interactive component.
   */
  @Type(() => View)
  view: View;

  /**
   * An array of objects that contain response_url values, used to send message responses.
   */
  @Expose({ name: 'response_urls' })
  @Type(() => ResponseUrl)
  responseUrls: ResponseUrl[];
}
