import { EventPayload } from '../slack/types/payloads/event-payload';

export const DUTCH_PAY_CREATED_EVENT = 'DUTCH_PAY_CREATED_EVENT';
export const PARTICIPANT_PAID_BACK_EVENT = 'PARTICIPANT_PAY_BACK_EVENT';
export const DUTCH_PAY_DELETED_EVENT = 'DUTCH_PAY_DELETED_EVENT';

export const APP_UNINSTALLED_EVENT = 'TOKENS_WAS_REVOKED_EVENT';

/**
 * 이벤트 명-이벤트 페이로드 타입 맵
 */
export interface EventNameToEventPayloadMap {
  [DUTCH_PAY_CREATED_EVENT]: number;
  [PARTICIPANT_PAID_BACK_EVENT]: number;
  [DUTCH_PAY_DELETED_EVENT]: number;
  [APP_UNINSTALLED_EVENT]: EventPayload;

  [key: string]: any;
}
