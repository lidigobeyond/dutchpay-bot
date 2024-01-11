import { Event, EventType } from './event';

/**
 * Your Slack app was uninstalled
 * 참고 : https://api.slack.com/events/app_uninstalled
 */
export class AppUninstalledEvent extends Event {
  type = EventType.APP_UNINSTALLED;
}
