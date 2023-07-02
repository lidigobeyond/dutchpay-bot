import { ModalView } from '@slack/web-api';

export interface IModal {
  /**
   * 참고 : https://api.slack.com/reference/surfaces/views
   */
  toModalView(): ModalView;
}
