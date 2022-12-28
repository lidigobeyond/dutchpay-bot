import { Expose } from 'class-transformer';

/**
 * slash command 가 호출되었을 때 발생하는 요청 바디 형식
 * 참고 : https://api.slack.com/interactivity/slash-commands#app_command_handling
 */
export class SlashCommandPayload {
  /**
   * verification token
   */
  token: string;

  /**
   * The command that was typed in to trigger this request
   */
  command: string;

  /**
   * This is the part of the Slash Command after the command itself, and it can contain absolutely anything that the user might decide to type
   */
  text?: string;

  /**
   * A temporary webhook URL that you can use to generate messages responses
   */
  @Expose({ name: 'response_url' })
  responseUrl: string;

  /**
   * A short-lived ID that will let your app open a modal
   */
  @Expose({ name: 'trigger_id' })
  triggerId: string;

  /**
   * The ID of the user who triggered the command
   */
  @Expose({ name: 'user_id' })
  userId: string;

  /**
   * The plain text name of the user who triggered the command
   */
  @Expose({ name: 'user_name' })
  userName: string;

  /**
   * The ID of the workspace where the user are joined
   */
  @Expose({ name: 'team_id' })
  workspaceId: string;

  /**
   * The ID of the channel where the user triggered the command
   */
  @Expose({ name: 'channel_id' })
  channelId: string;

  /**
   * The plain text name of the channel where user triggered the command
   */
  @Expose({ name: 'channel_name' })
  channelName: string;

  /**
   * Your Slack app's unique identifier
   */
  @Expose({ name: 'api-app-id' })
  apiAppId: string;
}
