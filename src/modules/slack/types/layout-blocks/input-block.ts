import { InputBlock as Parent } from '@slack/web-api';
import { PlainTextInputElement } from '../block-elements/plain-text-input-element';
import { DatePickerElement } from '../block-elements/date-picker-element';
import { ConversationSelectElement } from '../block-elements/conversation-select-element';
import { PlainTextElement } from '../block-elements/plain-text-element';

export type InputBlockArgs = {
  id: string;
  element: PlainTextInputElement | DatePickerElement | ConversationSelectElement;
  label: string;
  optional?: boolean;
};

/**
 * A block that collects information from users
 * 참고 : https://api.slack.com/reference/block-kit/blocks#input
 */
export class InputBlock implements Parent {
  type: 'input' = 'input';
  block_id: string;
  label: PlainTextElement;
  element: PlainTextInputElement | DatePickerElement | ConversationSelectElement;
  optional?: boolean;

  constructor(args: InputBlockArgs) {
    const { id, element, label, optional } = args;

    this.block_id = id;
    this.element = element;
    this.label = new PlainTextElement(label);
    this.optional = optional ?? undefined;
  }
}
