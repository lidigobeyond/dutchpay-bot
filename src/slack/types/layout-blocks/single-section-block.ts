import { SectionBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';
import { MarkDownElement } from '../composition-objects/mark-down-element';
import { ButtonElement } from '../block-elements/button-element';
import { OverflowMenuElement } from '../block-elements/overflow-menu-element';

export interface SingleSectionBlockArgs {
  text: PlainTextElement | MarkDownElement;
  accessory?: ButtonElement | OverflowMenuElement;
}

/**
 * 참고 : https://api.slack.com/reference/block-kit/blocks?ref=bk#section
 */
export class SingleSectionBlock implements Parent {
  type: 'section' = 'section';
  text: PlainTextElement | MarkDownElement;
  accessory?: ButtonElement | OverflowMenuElement;

  constructor(args: SingleSectionBlockArgs) {
    const { text, accessory } = args;

    this.text = text;
    this.accessory = accessory;
  }
}
