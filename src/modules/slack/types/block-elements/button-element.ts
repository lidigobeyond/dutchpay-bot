import { Button as Parent } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element';

export type ButtonElementConfirm = {
  title?: PlainTextElement;
  text: PlainTextElement;
  confirm: PlainTextElement;
  deny: PlainTextElement;
};

export type ButtonElementArgs = {
  actionId: string;
  text: PlainTextElement;
  style?: 'primary' | 'danger';
  confirm?: ButtonElementConfirm;
};

/**
 * 참고 : https://api.slack.com/reference/block-kit/block-elements#button
 */
export class ButtonElement implements Parent {
  type: 'button' = 'button';
  text: PlainTextElement;
  action_id: string;
  style?: 'primary' | 'danger';
  confirm?: ButtonElementConfirm;

  constructor(args: ButtonElementArgs) {
    const { actionId, text, style, confirm } = args;

    this.action_id = actionId;
    this.text = text;
    this.style = style;
    this.confirm = confirm;
  }
}
