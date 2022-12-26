import { Expose, Type } from 'class-transformer';

/**
 * The user who interacted to trigger this request.
 */
export class User {
  /**
   * An ID of the user who triggered the command.
   */
  id: string;

  /**
   * A plain text name of the user who triggered the command.
   */
  username: string;

  /**
   * An ID of the team which the user belongs to.
   */
  @Expose({ name: 'team_id' })
  teamId: string;
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
 * block element 를 클릭했을 때 발생하는 요청 바디 형식
 * 참고 : https://api.slack.com/reference/interaction-payloads/block-actions#fields
 */
export class BlockActionsPayload {
  /**
   * Helps identify which type of interactive component sent the payload.
   */
  type: 'block_actions';

  /**
   * A short-lived ID that can be used to open modals.
   */
  @Expose({ name: 'trigger_id' })
  triggerId: string;

  /**
   * A short-lived webhook that can be used to send messages in response to interactions.
   */
  @Expose({ name: 'response_url' })
  responseUrl: string;

  /**
   * The user who interacted to trigger this request.
   */
  @Type(() => User)
  user: User;

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

  /**
   * Represents a deprecated verification token feature.
   */
  token: string;

  /**
   * A unique value which is optionally accepted in views.update and views.publish API calls.
   */
  hash: string;
}
