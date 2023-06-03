import { IMessage } from '../../../modules/slack/interfaces/message.interface';
import { Block, KnownBlock } from '@slack/types';
import dayjs from 'dayjs';
import { SingleSectionBlock } from '../../../modules/slack/types/layout-blocks/single-section-block';
import { PlainTextElement } from '../../../modules/slack/types/block-elements/plain-text-element';
import { DividerBlock } from '../../../modules/slack/types/layout-blocks/divider-block';
import { MarkDownElement } from '../../../modules/slack/types/block-elements/mark-down-element';
import { ButtonElement } from '../../../modules/slack/types/block-elements/button-element';
import { DUTCH_PAY_REQUEST_MESSAGE_PAY_BACK_ACTION_ID } from '../dutch-pay-request-message.constant';

export interface DutchPayRequestMessageArgs {
  createUserId: string;
  title: string;
  date: dayjs.Dayjs;
  description?: string;
  price: string;
  isPayBack: boolean;
}

export class DutchPayRequestMessage implements IMessage {
  private readonly createUserId: string;
  private readonly title: string;
  private readonly date: dayjs.Dayjs;
  private readonly description?: string;
  private readonly price: string;
  private readonly isPayBack: boolean;

  constructor(args: DutchPayRequestMessageArgs) {
    const { createUserId, title, date, description, price, isPayBack } = args;

    this.createUserId = createUserId;
    this.title = title;
    this.date = date;
    this.description = description;
    this.price = price;
    this.isPayBack = isPayBack;
  }

  toBlocks(): (KnownBlock | Block)[] {
    return [
      new SingleSectionBlock({ text: new MarkDownElement(`<@${this.createUserId}> 님께서 더치 페이를 요청하셨습니다.`) }),
      new DividerBlock(),
      new SingleSectionBlock({ text: new MarkDownElement('*제목:*') }),
      new SingleSectionBlock({ text: new MarkDownElement(`> ${this.title}`) }),
      new SingleSectionBlock({ text: new MarkDownElement('*날짜:*') }),
      new SingleSectionBlock({ text: new MarkDownElement(`> ${this.date.format('YYYY년 MM월 DD일')}`) }),
      ...(() => {
        if (!this.description) {
          return [];
        }

        return [
          new SingleSectionBlock({ text: new MarkDownElement('*설명:*') }),
          new SingleSectionBlock({
            text: new MarkDownElement(
              this.description
                .split('\n')
                .map((line) => `> ${line}`)
                .join('\n'),
            ),
          }),
        ];
      })(),
      new SingleSectionBlock({ text: new MarkDownElement('*입금해야 할 금액:*') }),
      new SingleSectionBlock({ text: new MarkDownElement(`> ${this.price}`) }),
      new DividerBlock(),
      ...(() => {
        if (this.isPayBack) {
          return [
            new SingleSectionBlock({
              text: new PlainTextElement(`입금 완료하셨습니다 👍`),
            }),
          ];
        } else {
          return [
            new SingleSectionBlock({
              text: new PlainTextElement(`입금 완료하셨다면 '입금 완료' 버튼을 눌러주세요.`),
              accessory: new ButtonElement({
                actionId: DUTCH_PAY_REQUEST_MESSAGE_PAY_BACK_ACTION_ID,
                text: new PlainTextElement('입금 완료'),
                style: 'primary',
                confirm: {
                  title: new PlainTextElement('입금 완료 처리하겠습니까?'),
                  text: new PlainTextElement('입금 완료 처리하시면 다시 되돌릴 수 없습니다.'),
                  confirm: new PlainTextElement('예'),
                  deny: new PlainTextElement('아니요'),
                },
              }),
            }),
          ];
        }
      })(),
    ];
  }
}
