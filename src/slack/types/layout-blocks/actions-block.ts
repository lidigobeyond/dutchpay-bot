import { ActionsBlock as Parent } from '@slack/web-api';
import { DatePickerElement } from '../block-elements/date-picker-element';
import { ConversationSelectElement } from '../block-elements/conversation-select-element';

export interface ActionsBlockArgs {
  id: string;
  elements: (DatePickerElement | ConversationSelectElement)[];
}

/**
 * A block that is used to hold interactive elements.
 * 참고 : https://api.slack.com/reference/block-kit/blocks#actions
 */
export class ActionsBlock implements Parent {
  type: 'actions' = 'actions';
  block_id?: string;
  elements: (DatePickerElement | ConversationSelectElement)[];

  constructor(args: ActionsBlockArgs) {
    const { id, elements } = args;

    this.block_id = id;
    this.elements = elements;
  }
}
