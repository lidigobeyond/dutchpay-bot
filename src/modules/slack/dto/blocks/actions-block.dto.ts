import { ActionsBlock as Parent } from '@slack/web-api';
import { DatePickerElement } from '../block-elements/date-picker-element.dto';
import { UsersSelectElement } from '../block-elements/users-select-element.dto';

export type ActionsBlockArgs = {
  id: string;
  elements: (DatePickerElement | UsersSelectElement)[];
};

export class ActionsBlock implements Parent {
  type: 'actions' = 'actions';
  block_id?: string;
  elements: (DatePickerElement | UsersSelectElement)[];

  constructor(args: ActionsBlockArgs) {
    const { id, elements } = args;

    this.block_id = id;
    this.elements = elements;
  }
}
