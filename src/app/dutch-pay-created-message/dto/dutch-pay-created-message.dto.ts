import { IMessage } from '../../../modules/slack/interfaces/message.interface';
import { Block, KnownBlock } from '@slack/web-api';
import dayjs from 'dayjs';
import { MultiSectionBlock } from '../../../modules/slack/types/layout-blocks/multi-section-block';
import { PlainTextElement } from '../../../modules/slack/types/block-elements/plain-text-element';
import { MarkDownElement } from '../../../modules/slack/types/block-elements/mark-down-element';
import { SingleSectionBlock } from '../../../modules/slack/types/layout-blocks/single-section-block';
import { DividerBlock } from '../../../modules/slack/types/layout-blocks/divider-block';

export interface DutchPayCreatedMessageArgs {
  title: string;
  date: dayjs.Dayjs;
  description?: string;
  participants: { userId: string; price: string; isPayBack: boolean }[];
}

export class DutchPayCreatedMessage implements IMessage {
  private readonly title: string;
  private readonly date: dayjs.Dayjs;
  private readonly description?: string;
  private readonly participants: { userId: string; price: string; isPayBack: boolean }[];

  constructor(args: DutchPayCreatedMessageArgs) {
    const { title, date, description, participants } = args;

    this.title = title;
    this.date = date;
    this.description = description;
    this.participants = participants;
  }

  toBlocks(): (KnownBlock | Block)[] {
    return [
      new SingleSectionBlock({ text: new PlainTextElement('더치 페이가 생성되었습니다.') }),
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
