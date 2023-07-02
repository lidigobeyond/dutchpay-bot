import { Expose, Type } from 'class-transformer';
import { Event, EventType } from '../events/event';
import { AppHomeOpenedEvent } from '../events/app-home-opened-event';

/**
 * 구독하고 있는 특정 이벤트가 발생했을 때 발생하는 요청 바디
 * 참고 : https://api.slack.com/apis/connections/events-api#callback-field
 */
export class EventPayload {
  /**
   * The unique identifier for the workspace/team where this event occurred.
   */
  @Expose({ name: 'team_id' })
  teamId: string;

  /**
   * The unique identifier for the application this event is intended for.
   */
  @Expose({ name: 'api_app_id' })
  apiAppId: string;

  /**
   * Contains the inner set of fields representing the event that's happening.
   */
  @Type(() => Event, {
    discriminator: {
      property: 'type',
      subTypes: [{ value: AppHomeOpenedEvent, name: EventType.APP_HOME_OPENED }],
    },
    keepDiscriminatorProperty: true,
  })
  event: Event;

  /**
   *  A unique identifier for this specific event, globally unique across all workspaces.
   */
  @Expose({ name: 'event_id' })
  eventId: string;

  /**
   * The epoch timestamp in seconds indicating when this event was dispatched.
   */
  @Expose({ name: 'event_time' })
  eventTime: number;
}
