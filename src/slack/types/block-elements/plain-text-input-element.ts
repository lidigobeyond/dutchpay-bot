import { PlainTextInput as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';

export interface PlainTextInputElementArgs {
  actionId: string;
  initialValue?: string;
  placeholder?: string;
  multiline?: boolean;
  minLength?: number;
  maxLength?: number;
  focusOnLoad?: boolean;
}

/**
 * A plain-text input, similar to the HTML <input> tag, creates a field where a user can enter freeform data.
 * 참고 : https://api.slack.com/reference/block-kit/block-elements#input
 */
export class PlainTextInputElement implements Parent {
  type: 'plain_text_input' = 'plain_text_input';
  action_id: string;
  placeholder?: PlainTextElement;
  initial_value?: string;
  multiline?: boolean;
  min_length?: number;
  max_length?: number;
  focus_on_load?: boolean;

  constructor(args: PlainTextInputElementArgs) {
    const { actionId, placeholder, initialValue, multiline, minLength, maxLength, focusOnLoad } = args;

    this.action_id = actionId;
    this.placeholder = placeholder ? new PlainTextElement(placeholder) : undefined;
    this.initial_value = initialValue ?? undefined;
    this.multiline = multiline ?? undefined;
    this.min_length = minLength;
    this.max_length = maxLength;
    this.focus_on_load = focusOnLoad;
  }
}

/**
 * A state of plain-text input element
 */
export interface StateOfPlainTextInputElement {
  type: 'plain_text_input';

  value?: string;
}
