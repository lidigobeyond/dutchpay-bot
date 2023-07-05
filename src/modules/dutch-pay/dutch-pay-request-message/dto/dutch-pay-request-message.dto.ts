import { IMessage } from '../../../../slack/interfaces/message.interface';
import { Block, KnownBlock } from '@slack/types';
import dayjs from 'dayjs';
import { SingleSectionBlock } from '../../../../slack/types/layout-blocks/single-section-block';
import { PlainTextElement } from '../../../../slack/types/composition-objects/plain-text-element';
import { DividerBlock } from '../../../../slack/types/layout-blocks/divider-block';
import { MarkDownElement } from '../../../../slack/types/composition-objects/mark-down-element';
import { ButtonElement } from '../../../../slack/types/block-elements/button-element';
import { PAID_BACK_ACTION_ID } from '../dutch-pay-request-message.constant';
import { ConfirmationDialogElement } from '../../../../slack/types/composition-objects/confirmation-dialog-element';

export interface DutchPayRequestMessageArgs {
  createUserId: string;
  title: string;
  date: dayjs.Dayjs;
  description?: string;
  isDutchPayDeleted: boolean;
  price: string;
  isPayBack: boolean;
}

export class DutchPayRequestMessage implements IMessage {
  private readonly createUserId: string;
  private readonly title: string;
  private readonly date: dayjs.Dayjs;
  private readonly description?: string;
  private readonly isDutchPayDeleted: boolean;
  private readonly price: string;
  private readonly isPayBack: boolean;

  constructor(args: DutchPayRequestMessageArgs) {
    const { createUserId, title, date, description, price, isPayBack, isDutchPayDeleted } = args;

    this.createUserId = createUserId;
    this.title = title;
    this.date = date;
    this.description = description;
    this.isDutchPayDeleted = isDutchPayDeleted;
    this.price = price;
    this.isPayBack = isPayBack;
  }

  toBlocks(): (KnownBlock | Block)[] {
    if (this.isDutchPayDeleted) {
      return [new SingleSectionBlock({ text: new MarkDownElement(`<@${this.createUserId}> 님께서 더치페이를 삭제하셨습니다.`) })];
    }

    return [
      new SingleSectionBlock({ text: new MarkDownElement(`<@${this.createUserId}> 님께서 더치페이를 요청하셨습니다.`) }),
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
              text: new PlainTextElement(`${dayjs().format('YYYY년 M월 D일 A h:mm:ss')} 에 입금 완료 처리하셨습니다 👍`),
            }),
          ];
        } else {
          return [
            new SingleSectionBlock({
              text: new PlainTextElement(`입금 완료하셨다면 '입금 완료' 버튼을 눌러주세요.`),
              accessory: new ButtonElement({
                actionId: PAID_BACK_ACTION_ID,
                text: new PlainTextElement('입금 완료'),
                style: 'primary',
                confirm: new ConfirmationDialogElement({
                  title: new PlainTextElement('입금 완료 처리하겠습니까?'),
                  text: new PlainTextElement('입금 완료 처리하시면 다시 되돌릴 수 없습니다.'),
                  confirm: new PlainTextElement('예'),
                  deny: new PlainTextElement('아니요'),
                }),
              }),
            }),
          ];
        }
      })(),
    ];
  }
}
