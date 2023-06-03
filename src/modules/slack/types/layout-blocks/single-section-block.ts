import { SectionBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../block-elements/plain-text-element';
import { MarkDownElement } from '../block-elements/mark-down-element';
import { ButtonElement } from '../block-elements/button-element';

export type SingleSectionBlockArgs = {
  text: PlainTextElement | MarkDownElement;
  accessory?: ButtonElement;
};

/**
 * 참고 : https://api.slack.com/reference/block-kit/blocks?ref=bk#section
 */
export class SingleSectionBlock implements Parent {
  type: 'section' = 'section';
  text: PlainTextElement | MarkDownElement;
  accessory?: ButtonElement;

  constructor(args: SingleSectionBlockArgs) {
    const { text, accessory } = args;

    this.text = text;
    this.accessory = accessory;
  }
}
