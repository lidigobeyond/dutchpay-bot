import { Button as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';
import { ConfirmationDialogElement } from '../composition-objects/confirmation-dialog-element';

export interface ButtonElementArgs {
  actionId: string;
  text: PlainTextElement;
  style?: 'primary' | 'danger';
  confirm?: ConfirmationDialogElement;
}

/**
 * 참고 : https://api.slack.com/reference/block-kit/block-elements#button
 */
export class ButtonElement implements Parent {
  type: 'button' = 'button';
  text: PlainTextElement;
  action_id: string;
  style?: 'primary' | 'danger';
  confirm?: ConfirmationDialogElement;

  constructor(args: ButtonElementArgs) {
    const { actionId, text, style, confirm } = args;

    this.action_id = actionId;
    this.text = text;
    this.style = style;
    this.confirm = confirm;
  }
}
