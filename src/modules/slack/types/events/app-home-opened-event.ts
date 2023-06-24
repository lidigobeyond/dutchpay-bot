import { Event, EventType } from './event';

/**
 * User clicked into your App Home
 * 참고 : https://api.slack.com/events/app_home_opened
 */
export class AppHomeOpenedEvent extends Event {
  type: EventType.APP_HOME_OPENED;

  channel: string;
}
