import { Expose, Type } from 'class-transformer';
import { InteractionPayload } from './interaction-payload';
import { ModalView } from '@slack/types';
import { Block, KnownBlock, PlainTextElement } from '@slack/web-api';

/**
 * A dictionary of objects. Each object represents a block in the source view that contained stateful, interactive components.
 */
export class ViewState {
  values: Record<string, Record<string, any>>;
}

/**
 * The source view containing clicked interactive component.
 * 참고 : https://api.slack.com/reference/surfaces/views
 */
export class View implements ModalView {
  id: string;
  type: 'modal';
  title: PlainTextElement;
  blocks: (KnownBlock | Block)[];
  close: PlainTextElement;
  submit: PlainTextElement;
  private_metadata: string;
  callback_id: string;
  clear_on_close: boolean;
  notify_on_close: boolean;
  external_id: string;

  /**
   * A dictionary of objects. Each object represents a block in the source view that contained stateful, interactive components.
   */
  @Type(() => ViewState)
  state: ViewState;
}

/**
 * 참고 : https://api.slack.com/reference/interaction-payloads/block-actions#examples
 */
export class Message {
  bot_id: string;

  type: 'message';

  text: string;

  user: string;

  team: string;

  ts: string;

  blocks: Record<string, any>[];
}

/**
 * Contains data from the specific interactive component that was used.
 */
export class Action {
  /**
   * A type of the interactive component
   */
  type: string;

  /**
   * Identifies the block within a surface that contained the interactive component that was used.
   */
  @Expose({ name: 'block_id' })
  blockId: string;

  /**
   * Identifies the interactive component itself.
   */
  @Expose({ name: 'action_id' })
  actionId: string;
}

/**
 * block element 를 클릭했을 때 발생하는 요청 바디 형식
 * 참고 : https://api.slack.com/reference/interaction-payloads/block-actions#fields
 */
export class BlockActionsPayload extends InteractionPayload {
  /**
   * A short-lived webhook that can be used to send messages in response to interactions.
   */
  @Expose({ name: 'response_url' })
  responseUrl: string;

  /**
   * The source view containing clicked interactive component.
   */
  @Type(() => View)
  view?: View;

  /**
   * The message where this block action took place
   */
  @Type(() => Message)
  message?: Message;

  /**
   * Contains data from the specific interactive component that was used.
   */
  @Type(() => Action)
  actions: Action[];
}
