import { PlainTextElement as Parent } from '@slack/web-api';

export class PlainTextElement implements Parent {
  type: 'plain_text' = 'plain_text';

  constructor(public readonly text: string) {}
}
