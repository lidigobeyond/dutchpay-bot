import { ConversationsSelect as Parent } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element';

export type UsersSelectElementArgs = {
  actionId: string;
  initialUser?: string;
  placeholder?: string;
};

/**
 * A select menu, just as with a standard HTML <select> tag, creates a drop down menu with a list of options for a user to choose.
 * 참고 : https://api.slack.com/reference/block-kit/block-elements?ref=bk#conversation_multi_select
 */
export class ConversationSelectElement implements Parent {
  type: 'conversations_select' = 'conversations_select';
  action_id: string;
  filter?: {
    include?: ('im' | 'mpim' | 'private' | 'public')[];
    exclude_external_shared_channels?: boolean;
    exclude_bot_users?: boolean;
  };
  placeholder?: PlainTextElement;

  constructor(args: UsersSelectElementArgs) {
    const { actionId, placeholder } = args;

    this.action_id = actionId;
    this.filter = { include: ['im'], exclude_bot_users: true };
    this.placeholder = placeholder ? new PlainTextElement(placeholder) : undefined;
  }
}

/**
 * A state of Users select Element
 */
export interface SateOfUsersSelectElement {
  type: 'conversations_select';

  selected_conversation?: string;
}
