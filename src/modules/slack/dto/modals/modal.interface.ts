import { ModalView } from '@slack/web-api';

export interface IModal {
  toModalView(): ModalView;
}
