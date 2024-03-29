import { MrkdwnElement as Parent } from '@slack/web-api';

/**
 * An object containing some markdown text
 * 참고 : https://api.slack.com/reference/block-kit/composition-objects?ref=bk#text
 */
export class MarkDownElement implements Parent {
  type: 'mrkdwn' = 'mrkdwn';
  text: string;

  constructor(markdown: string) {
    this.text = markdown;
  }
}
