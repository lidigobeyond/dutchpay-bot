import { SectionBlock as Parent } from '@slack/web-api';
import { PlainTextElement } from '../block-elements/plain-text-element';
import { MarkDownElement } from '../block-elements/mark-down-element';

/**
 * 참고 : https://api.slack.com/reference/block-kit/blocks?ref=bk#section
 */
export class MultiSectionBlock implements Parent {
  type: 'section' = 'section';

  constructor(public fields: (PlainTextElement | MarkDownElement)[]) {}
}
