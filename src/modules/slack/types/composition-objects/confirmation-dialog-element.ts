import { Confirm, MrkdwnElement } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element';

export interface ConfirmationDialogElementArgs {
  title: PlainTextElement;
  text: PlainTextElement | MrkdwnElement;
  confirm: PlainTextElement;
  deny?: PlainTextElement;
  style?: 'primary' | 'danger';
}

/**
 * An object that defines a dialog that provides a confirmation step to any interactive element
 * 참고 : https://api.slack.com/reference/block-kit/composition-objects#confirm
 */
export class ConfirmationDialogElement implements Confirm {
  title: PlainTextElement;
  text: PlainTextElement | MrkdwnElement;
  confirm: PlainTextElement;
  deny?: PlainTextElement;
  style?: 'primary' | 'danger';

  constructor(args: ConfirmationDialogElementArgs) {
    const { title, text, confirm, deny, style } = args;

    this.title = title;
    this.text = text;
    this.confirm = confirm;
    this.deny = deny;
    this.style = style;
  }
}
