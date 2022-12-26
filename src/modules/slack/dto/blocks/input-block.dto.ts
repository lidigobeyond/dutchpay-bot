import { InputBlock as Parent } from '@slack/web-api';
import { PlainTextInputElement } from '../block-elements/plain-text-input-element.dto';
import { DatePickerElement } from '../block-elements/date-picker-element.dto';
import { UsersSelectElement } from '../block-elements/users-select-element.dto';
import { PlainTextElement } from '../block-elements/plain-text-element.dto';

export type InputBlockArgs = {
  id: string;
  element: PlainTextInputElement | DatePickerElement | UsersSelectElement;
  label: string;
  optional?: boolean;
};

/**
 * A block that collects information from users
 * https://api.slack.com/reference/block-kit/blocks#input
 */
export class InputBlock implements Parent {
  type: 'input' = 'input';
  block_id: string;
  label: PlainTextElement;
  element: PlainTextInputElement | DatePickerElement | UsersSelectElement;
  optional?: boolean;

  constructor(args: InputBlockArgs) {
    const { id, element, label, optional } = args;

    this.block_id = id;
    this.element = element;
    this.label = new PlainTextElement(label);
    this.optional = optional ?? undefined;
  }
}
