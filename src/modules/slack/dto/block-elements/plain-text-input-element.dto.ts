import { PlainTextInput as Parent } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element.dto';

export type PlainTextInputElementArgs = {
  actionId: string;
  initialValue?: string;
  placeholder?: string;
  multiline?: boolean;
};

/**
 * A plain-text input, similar to the HTML <input> tag, creates a field where a user can enter freeform data.
 * https://api.slack.com/reference/block-kit/block-elements#input
 */
export class PlainTextInputElement implements Parent {
  type: 'plain_text_input' = 'plain_text_input';
  action_id: string;
  placeholder?: PlainTextElement;
  initial_value?: string;
  multiline?: boolean;

  constructor(args: PlainTextInputElementArgs) {
    const { actionId, placeholder, initialValue, multiline } = args;

    this.action_id = actionId;
    this.placeholder = placeholder ? new PlainTextElement(placeholder) : undefined;
    this.initial_value = initialValue ?? undefined;
    this.multiline = multiline ?? undefined;
  }
}

/**
 * A state of plain-text input element
 */
export interface StateOfPlainTextInputElement {
  type: 'plain_text_input';

  value?: string;
}
