import { Expose, Type } from 'class-transformer';
import { InteractionPayload } from './interaction-payload.dto';

/**
 * A dictionary of objects. Each object represents a block in the source view that contained stateful, interactive components.
 */
export class StateOfView {
  values: Record<string, Record<string, any>>;
}

/**
 * The source view containing clicked interactive component.
 */
export class View {
  id: string;

  type: 'modal';

  /**
   * A dictionary of objects. Each object represents a block in the source view that contained stateful, interactive components.
   */
  @Type(() => StateOfView)
  state: StateOfView;
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
   * Contains data from the specific interactive component that was used.
   */
  @Type(() => Action)
  actions: Action[];
}
