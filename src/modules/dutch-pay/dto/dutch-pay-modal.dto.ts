import { IModal } from '../../slack/dto/modals/modal.interface';
import dayjs from 'dayjs';
import { ModalView } from '@slack/web-api';
import { PlainTextElement } from '../../slack/dto/block-elements/plain-text-element.dto';
import { PlainTextInputElement } from '../../slack/dto/block-elements/plain-text-input-element.dto';
import { DatePickerElement } from '../../slack/dto/block-elements/date-picker-element.dto';
import { UsersSelectElement } from '../../slack/dto/block-elements/users-select-element.dto';
import { InputBlock } from '../../slack/dto/blocks/input-block.dto';
import { HeaderBlock } from '../../slack/dto/blocks/header-block.dto';
import { ActionsBlock } from '../../slack/dto/blocks/actions-block.dto';

export type DutchPayParticipant = {
  id: string;
  price?: string;
};

export type DutchPayModalArgs = {
  title?: string;
  datetime?: dayjs.Dayjs;
  description?: string;
  participants?: DutchPayParticipant[];
};

export class DutchPayModal implements IModal {
  private title?: string;
  private datetime?: dayjs.Dayjs;
  private description?: string;
  private participants: DutchPayParticipant[];

  constructor(args: DutchPayModalArgs) {
    const { title, datetime, description, participants } = args;

    this.title = title;
    this.datetime = datetime;
    this.description = description;
    this.participants = participants ?? [];
  }

  toModalView(): ModalView {
    return {
      type: 'modal',
      title: new PlainTextElement('더치 페이 생성'),
      submit: new PlainTextElement('생성'),
      close: new PlainTextElement('취소'),
      blocks: [
        new InputBlock({
          id: 'title',
          label: '제목',
          element: new PlainTextInputElement({
            actionId: 'title',
            placeholder: '예) 점심 강남 진해장국',
            initialValue: this.title,
          }),
        }),
        new InputBlock({
          id: 'datetime',
          label: '날짜',
          element: new DatePickerElement({
            actionId: 'datetime',
            initialDate: (this.datetime ?? dayjs()).format('YYYY-MM-DD'),
          }),
        }),
        new InputBlock({
          id: 'description',
          label: '내용',
          element: new PlainTextInputElement({
            actionId: 'description',
            placeholder: '예) 기업은행 김기현 123-467890-12-345 계좌로 임급해주세요!',
            initialValue: this.description,
            multiline: true,
          }),
          optional: true,
        }),
        new HeaderBlock('참여자'),
        ...this.participants.map((participant) => {
          const { id, price } = participant;

          return new InputBlock({
            id: 'participants/' + id,
            label: `<@${id}> 이(가) 내야 할 금액`,
            element: new PlainTextInputElement({
              actionId: 'price',
              placeholder: '예) 12000원',
              initialValue: price,
            }),
          });
        }),
        new ActionsBlock({
          id: 'user-select',
          elements: [
            new UsersSelectElement({
              actionId: 'user-select',
              placeholder: '참여자 추가하기',
            }),
          ],
        }),
      ],
    };
  }
}
