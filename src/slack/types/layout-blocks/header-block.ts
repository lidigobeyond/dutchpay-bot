import { HeaderBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';

/**
 * A header is a plain-text block that displays in a larger, bold font. Use it to delineate between different groups of content in your app's surfaces.
 * 참고 : https://api.slack.com/reference/block-kit/blocks#header
 */
export class HeaderBlock implements Parent {
  type: 'header' = 'header';
  text: PlainTextElement;

  constructor(text: string) {
    this.text = new PlainTextElement(text);
  }
}
