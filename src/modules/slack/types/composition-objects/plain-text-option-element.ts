import { PlainTextOption } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element';

export interface PlainTextOptionElementArgs {
  text: PlainTextElement;
  value?: string;
  url?: string;
  description?: PlainTextElement;
}

/**
 * An object that represents a single selectable item in a select menu, multi-select menu, checkbox group, radio button group, or overflow menu.
 * 참고 : https://api.slack.com/reference/block-kit/composition-objects#option
 */
export class PlainTextOptionElement implements PlainTextOption {
  text: PlainTextElement;
  value?: string;
  url?: string;
  description?: PlainTextElement;

  constructor(args: PlainTextOptionElementArgs) {
    const { text, value, url, description } = args;

    this.text = text;
    this.value = value;
    this.url = url;
    this.description = description;
  }
}
