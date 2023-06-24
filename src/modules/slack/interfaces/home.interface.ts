import { HomeView } from '@slack/web-api';

export interface IHome {
  /**
   * 참고 : https://api.slack.com/reference/surfaces/views#home-fields
   */
  toHomeView(): HomeView;
}
