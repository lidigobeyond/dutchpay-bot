import { IMessage } from '../../../modules/slack/interfaces/message.interface';
import { Block, KnownBlock } from '@slack/web-api';
import dayjs from 'dayjs';
import { MultiSectionBlock } from '../../../modules/slack/types/blocks/multi-section-block';
import { PlainTextElement } from '../../../modules/slack/types/block-elements/plain-text-element';
import { MarkDownElement } from '../../../modules/slack/types/block-elements/mark-down-element';
import { SingleSectionBlock } from '../../../modules/slack/types/blocks/single-section-block';

export interface DutchPayCreatedMessageArgs {
  title: string;
  date: dayjs.Dayjs;
  description?: string;
  participants: { userId: string; price: string }[];
}

export class DutchPayCreatedMessage implements IMessage {
  private readonly title: string;
  private readonly date: dayjs.Dayjs;
  private readonly description?: string;
  private readonly participants: { userId: string; price: string }[];

  constructor(args: DutchPayCreatedMessageArgs) {
    const { title, date, description, participants } = args;

    this.title = title;
    this.date = date;
    this.description = description;
    this.participants = participants;
  }

  toBlocks(): (KnownBlock | Block)[] {
    return [
      new MultiSectionBlock([new PlainTextElement('더치 페이가 생성되었습니다.')]),
      new MultiSectionBlock([
        new MarkDownElement('*제목:*'),
        new MarkDownElement('*날짜:*'),
        new MarkDownElement(`> ${this.title}`),
        new MarkDownElement(`> ${this.date.format('YYYY년 MM월 DD일')}`),
      ]),
      ...(() => {
        if (!this.description) {
          return [];
        }

        return [
          new MultiSectionBlock([new MarkDownElement('*설명:*')]),
          new SingleSectionBlock(
            new MarkDownElement(
              this.description
                .split('\n')
                .map((line) => `> ${line}`)
                .join('\n'),
            ),
          ),
        ];
      })(),
      new MultiSectionBlock([new MarkDownElement('*참여자*')]),
      new MultiSectionBlock([new MarkDownElement('*닉네임:*'), new MarkDownElement('*내야 할 금액:*')]),
      ...this.participants.map((participant) => {
        const { userId, price } = participant;

        return new MultiSectionBlock([new MarkDownElement(`<@${userId}>`), new MarkDownElement(price)]);
      }),
    ];
  }
}
