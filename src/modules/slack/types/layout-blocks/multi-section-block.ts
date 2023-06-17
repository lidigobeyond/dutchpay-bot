import { SectionBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../composition-objects/plain-text-element';
import { MarkDownElement } from '../composition-objects/mark-down-element';
import { ButtonElement } from '../block-elements/button-element';
import { OverflowMenuElement } from '../block-elements/overflow-menu-element';

export interface MultiSectionBlockArgs {
  fields: (PlainTextElement | MarkDownElement)[];
  accessory?: ButtonElement | OverflowMenuElement;
}

/**
 * 참고 : https://api.slack.com/reference/block-kit/blocks?ref=bk#section
 */
export class MultiSectionBlock implements Parent {
  type: 'section' = 'section';
  fields: (PlainTextElement | MarkDownElement)[];
  accessory?: ButtonElement | OverflowMenuElement;

  constructor(args: MultiSectionBlockArgs) {
    const { fields, accessory } = args;

    this.fields = fields;
    this.accessory = accessory;
  }
}
