import { SectionBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../block-elements/plain-text-element';
import { MarkDownElement } from '../block-elements/mark-down-element';
import { ButtonElement } from '../block-elements/button-element';

export type MultiSectionBlockArgs = {
  fields: (PlainTextElement | MarkDownElement)[];
  accessory?: ButtonElement;
};

/**
 * 참고 : https://api.slack.com/reference/block-kit/blocks?ref=bk#section
 */
export class MultiSectionBlock implements Parent {
  type: 'section' = 'section';
  fields: (PlainTextElement | MarkDownElement)[];
  accessory?: ButtonElement;

  constructor(args: MultiSectionBlockArgs) {
    const { fields, accessory } = args;

    this.fields = fields;
    this.accessory = accessory;
  }
}
