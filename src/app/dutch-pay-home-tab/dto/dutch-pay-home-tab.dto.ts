import { IHome } from '../../../slack/interfaces/home.interface';
import { HomeView } from '@slack/web-api';
import { SingleSectionBlock } from '../../../slack/types/layout-blocks/single-section-block';
import { DividerBlock } from '../../../slack/types/layout-blocks/divider-block';
import { MarkDownElement } from '../../../slack/types/composition-objects/mark-down-element';
import { ButtonElement } from '../../../slack/types/block-elements/button-element';
import { PlainTextElement } from '../../../slack/types/composition-objects/plain-text-element';
import { CREATE_DUTCH_PAY_ACTION_ID } from '../dutch-pay-home-tab.constant';

export class DutchPayHomeTab implements IHome {
  toHomeView(): HomeView {
    return {
      type: 'home',
      blocks: [
        new SingleSectionBlock({
          text: new MarkDownElement('👋 안녕하세요! 더치페이 봇입니다.'),
          accessory: new ButtonElement({
            actionId: CREATE_DUTCH_PAY_ACTION_ID,
            text: new PlainTextElement('더치페이 생성하기'),
            style: 'primary',
          }),
        }),
        new DividerBlock(),
      ],
    };
  }
}
