import { PlainTextElement as Parent } from '@slack/web-api';

/**
 * An object containing some plain text
 * 참고 : https://api.slack.com/reference/block-kit/composition-objects?ref=bk#text
 */
export class PlainTextElement implements Parent {
  type: 'plain_text' = 'plain_text';
  emoji: true;

  constructor(public readonly text: string) {}
}
