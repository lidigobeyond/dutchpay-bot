import { Datepicker as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';

export interface DatePickerElementArgs {
  actionId: string;
  initialDate?: string;
  placeholder?: string;
}

/**
 * An element which lets users easily select a date from a calendar style UI.
 * 참고 : https://api.slack.com/reference/block-kit/block-elements#datepicker
 */
export class DatePickerElement implements Parent {
  type: 'datepicker' = 'datepicker';
  action_id: string;
  initial_date?: string;
  placeholder?: PlainTextElement;

  constructor(args: DatePickerElementArgs) {
    const { actionId, initialDate, placeholder } = args;

    this.action_id = actionId;
    this.initial_date = initialDate;
    this.placeholder = placeholder ? new PlainTextElement(placeholder) : undefined;
  }
}

/**
 * A state of Date picker element
 */
export interface StateOfDatePickerElement {
  type: 'datepicker';

  selected_date?: string;
}
