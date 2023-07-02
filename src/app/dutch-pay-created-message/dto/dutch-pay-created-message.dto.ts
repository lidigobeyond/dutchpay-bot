import { IMessage } from '../../../slack/interfaces/message.interface';
import { Block, KnownBlock } from '@slack/web-api';
import dayjs from 'dayjs';
import { MultiSectionBlock } from '../../../slack/types/layout-blocks/multi-section-block';
import { PlainTextElement } from '../../../slack/types/composition-objects/plain-text-element';
import { MarkDownElement } from '../../../slack/types/composition-objects/mark-down-element';
import { SingleSectionBlock } from '../../../slack/types/layout-blocks/single-section-block';
import { DividerBlock } from '../../../slack/types/layout-blocks/divider-block';
import { OverflowMenuElement } from '../../../slack/types/block-elements/overflow-menu-element';
import { ConfirmationDialogElement } from '../../../slack/types/composition-objects/confirmation-dialog-element';
import { PlainTextOptionElement } from '../../../slack/types/composition-objects/plain-text-option-element';
import { DELETE_DUTCH_PAY_ACTION_ID } from '../dutch-pay-created-message.constant';

export interface DutchPayCreatedMessageArgs {
  title: string;
  date: dayjs.Dayjs;
  description?: string;
  participants: { userId: string; price: string; isPayBack: boolean }[];
  isDeleted: boolean;
}

export class DutchPayCreatedMessage implements IMessage {
  private readonly title: string;
  private readonly date: dayjs.Dayjs;
  private readonly description?: string;
  private readonly participants: { userId: string; price: string; isPayBack: boolean }[];
  private readonly isDeleted: boolean;

  private readonly isFinished: boolean;

  constructor(args: DutchPayCreatedMessageArgs) {
    const { title, date, description, participants, isDeleted } = args;

    this.title = title;
    this.date = date;
    this.description = description;
    this.participants = participants;
    this.isDeleted = isDeleted;

    this.isFinished = participants.every((participant) => participant.isPayBack);
  }

  toBlocks(): (KnownBlock | Block)[] {
    if (this.isDeleted) {
      return [new SingleSectionBlock({ text: new MarkDownElement('더치 페이가 삭제되었습니다.') })];
    }

    return [
      new SingleSectionBlock({
        text: new PlainTextElement('더치 페이가 생성되었습니다.'),
        accessory: this.isFinished
          ? undefined
          : new OverflowMenuElement({
              actionId: DELETE_DUTCH_PAY_ACTION_ID,
              options: [
                new PlainTextOptionElement({
                  text: new PlainTextElement('삭제하기'),
                }),
              ],
              confirm: new ConfirmationDialogElement({
                title: new PlainTextElement('삭제하시겠습니까?'),
                text: new PlainTextElement('삭제하면 다시 되돌릴 수 없습니다.'),
                confirm: new PlainTextElement('예'),
                deny: new PlainTextElement('아니요'),
                style: 'danger',
              }),
            }),
      }),
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
      new SingleSectionBlock({ text: new MarkDownElement('*참여자*') }),
      new MultiSectionBlock({ fields: [new MarkDownElement('*닉네임:*'), new MarkDownElement('*내야 할 금액:*')] }),
      ...this.participants.map((participant) => {
        const { userId, price, isPayBack } = participant;

        if (isPayBack) {
          return new MultiSectionBlock({ fields: [new MarkDownElement(`~<@${userId}>~`), new MarkDownElement(`~${price}~ (입금완료)`)] });
        } else {
          return new MultiSectionBlock({ fields: [new MarkDownElement(`<@${userId}>`), new MarkDownElement(price)] });
        }
      }),
      new DividerBlock(),
    ];
  }
}
