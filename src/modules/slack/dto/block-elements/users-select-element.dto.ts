import { UsersSelect as Parent } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element.dto';

export type UsersSelectElementArgs = {
  actionId: string;
  initialUser?: string;
  placeholder?: string;
};

/**
 * A select menu, just as with a standard HTML <select> tag, creates a drop down menu with a list of options for a user to choose.
 * https://api.slack.com/reference/block-kit/block-elements#users_select
 */
export class UsersSelectElement implements Parent {
  type: 'users_select' = 'users_select';
  action_id: string;
  initial_user?: string;
  placeholder?: PlainTextElement;

  constructor(args: UsersSelectElementArgs) {
    const { actionId, initialUser, placeholder } = args;

    this.action_id = actionId;
    this.initial_user = initialUser;
    this.placeholder = placeholder ? new PlainTextElement(placeholder) : undefined;
  }
}

/**
 * A state of Users select Element
 */
export interface SateOfUsersSelectElement {
  type: 'users_select';

  selected_user?: string;
}
