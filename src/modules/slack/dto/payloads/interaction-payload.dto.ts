import { Expose, Type } from 'class-transformer';

export enum InteractionType {
  BLOCK_ACTIONS = 'block_actions',
}

/**
 * The workspace that the interaction happened in.
 */
export class Team {
  id: string;

  domain: string;
}

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

export abstract class InteractionPayload {
  /**
   * Helps identify which type of interactive component sent the payload.
   */
  type: InteractionType;

  /**
   * A short-lived ID that can be used to open modals.
   */
  @Expose({ name: 'trigger_id' })
  triggerId: string;

  /**
   *
   * The workspace that the interaction happened in.
   */
  @Type(() => Team)
  team: Team;

  /**
   * The user who interacted to trigger this request.
   */
  @Type(() => User)
  user: User;

  /**
   * Represents a deprecated verification token feature.
   */
  token: string;

  /**
   * A unique value which is optionally accepted in views.update and views.publish API calls.
   */
  hash: string;
}
