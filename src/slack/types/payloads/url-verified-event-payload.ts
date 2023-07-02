import { EventType } from '../events/event';

/**
 * 참고 : https://api.slack.com/events/url_verification
 */
export class UrlVerifiedEventPayload {
  type: EventType.URL_VERIFIED;

  /**
   *
   */
  token: string;

  /**
   * a randomly generated string produced by Slack. The point of this is that you're going to respond to this request with a response body containing this value.
   */
  challenge: string;
}
