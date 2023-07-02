import { Overflow } from '@slack/web-api';
import { PlainTextOptionElement } from '../composition-objects/plain-text-option-element';
import { ConfirmationDialogElement } from '../composition-objects/confirmation-dialog-element';

export interface OverflowMenuElementArgs {
  actionId: string;
  options: PlainTextOptionElement[];
  confirm?: ConfirmationDialogElement;
}

/**
 * 참고 : https://api.slack.com/reference/block-kit/block-elements?ref=bk#overflow
 */
export class OverflowMenuElement implements Overflow {
  type: 'overflow' = 'overflow';
  action_id: string;
  options: PlainTextOptionElement[];
  confirm?: ConfirmationDialogElement;

  constructor(args: OverflowMenuElementArgs) {
    const { actionId, options, confirm } = args;

    this.action_id = actionId;
    this.options = options;
    this.confirm = confirm;
  }
}
