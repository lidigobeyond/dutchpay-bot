import { DividerBlock as Parent } from '@slack/web-api';

export class DividerBlock implements Parent {
  type: 'divider' = 'divider';
}
