import { Expose } from 'class-transformer';

export enum EventType {
  URL_VERIFIED = 'url_verification',
  APP_HOME_OPENED = 'app_home_opened',
  APP_UNINSTALLED = 'app_uninstalled',
}

/**
 * 이벤트 정보를 담고 있는 객체
 * 참고 : https://api.slack.com/apis/connections/events-api#event-type-structure
 */
export abstract class Event {
  /**
   * The specific name of the event described by its adjacent fields.
   */
  type: EventType;

  /**
   * The timestamp of the event.
   */
  @Expose({ name: 'event_ts' })
  eventTs: string;

  /**
   * The user ID belonging to the user that incited this action.
   */
  user: string;

  /**
   * The timestamp of what the event describes, which may occur slightly prior to the event being dispatched as described by event_ts
   */
  ts: string;
}
