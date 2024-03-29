import { IModal } from '../../../../slack/interfaces/modal.interface';
import dayjs from 'dayjs';
import { ModalView } from '@slack/web-api';
import { PlainTextElement } from '../../../../slack/types/composition-objects/plain-text-element';
import { PlainTextInputElement, StateOfPlainTextInputElement } from '../../../../slack/types/block-elements/plain-text-input-element';
import { DatePickerElement, StateOfDatePickerElement } from '../../../../slack/types/block-elements/date-picker-element';
import { ConversationSelectElement } from '../../../../slack/types/block-elements/conversation-select-element';
import { InputBlock } from '../../../../slack/types/layout-blocks/input-block';
import { HeaderBlock } from '../../../../slack/types/layout-blocks/header-block';
import { ActionsBlock } from '../../../../slack/types/layout-blocks/actions-block';
import { ViewState } from '../../../../slack/types/payloads/block-actions-payload';
import { DUTCH_PAY_MODAL_EXTERNAL_ID, USER_SELECTED_ACTION_ID } from '../dutch-pay.constant';

export type DutchPayParticipant = {
  id: string;
  price?: string;
};

export type DutchPayModalArgs = {
  title?: string;
  date?: dayjs.Dayjs;
  description?: string;
  participants?: DutchPayParticipant[];
};

export class DutchPayModal implements IModal {
  public readonly title?: string;
  public readonly date?: dayjs.Dayjs;
  public readonly description?: string;
  public readonly participants: DutchPayParticipant[];

  constructor(args: DutchPayModalArgs) {
    const { title, date, description, participants } = args;

    this.title = title;
    this.date = date;
    this.description = description;
    this.participants = participants ?? [];
  }

  public static fromViewState(state: ViewState): DutchPayModal {
    const title = (state.values.title_block.title as StateOfPlainTextInputElement).value;
    const date = (state.values.date_block.date as StateOfDatePickerElement).selected_date;
    const description = (state.values.description_block.description as StateOfPlainTextInputElement).value;
    const participants: DutchPayParticipant[] = Object.keys(state.values)
      .filter((key) => key.startsWith('participant_block/'))
      .map((key) => {
        const userId = key.split('/')[1];
        const price = (state.values[key].price as StateOfPlainTextInputElement).value;

        return {
          id: userId,
          price,
        };
      });

    return new this({ title, date: dayjs(date), description, participants });
  }

  toModalView(): ModalView {
    return {
      type: 'modal',
      title: new PlainTextElement('더치페이 생성'),
      blocks: [
        new InputBlock({
          id: 'title_block',
          label: '제목',
          element: new PlainTextInputElement({
            actionId: 'title',
            placeholder: '예) 점심 강남 진해장국',
            initialValue: this.title,
            multiline: false,
            maxLength: 50,
            focusOnLoad: true,
          }),
        }),
        new InputBlock({
          id: 'date_block',
          label: '날짜',
          element: new DatePickerElement({
            actionId: 'date',
            initialDate: (this.date ?? dayjs()).format('YYYY-MM-DD'),
          }),
        }),
        new InputBlock({
          id: 'description_block',
          label: '내용',
          element: new PlainTextInputElement({
            actionId: 'description',
            placeholder: '예) 기업은행 김기현 123-467890-12-345 계좌로 임급해주세요!',
            initialValue: this.description,
            multiline: true,
          }),
          optional: true,
        }),
        new HeaderBlock('참여자 (최대 10명)'),
        ...this.participants.map((participant) => {
          const { id, price } = participant;

          return new InputBlock({
            id: 'participant_block/' + id,
            label: `<@${id}> 이(가) 내야 할 금액`,
            element: new PlainTextInputElement({
              actionId: 'price',
              placeholder: '예) 12000원',
              initialValue: price,
              maxLength: 15,
            }),
          });
        }),
        new ActionsBlock({
          id: 'user_select_block',
          elements: [
            new ConversationSelectElement({
              actionId: USER_SELECTED_ACTION_ID,
              placeholder: '참여자 추가하기',
            }),
          ],
        }),
      ],
      submit: new PlainTextElement('생성'),
      close: new PlainTextElement('취소'),
      external_id: DUTCH_PAY_MODAL_EXTERNAL_ID + '/' + `${dayjs().valueOf()}` + `${Math.random()}`,
    };
  }

  /**
   * 참여자를 새로 추가합니다.
   * @param newParticipant
   */
  addParticipant(newParticipant: DutchPayParticipant) {
    // 참여자는 최대 10명까지만 추가 가능
    if (this.participants.length >= 10) {
      return;
    }

    const isDuplicated = this.participants.some((participant) => participant.id === newParticipant.id);
    if (isDuplicated) {
      return;
    }

    this.participants.push(newParticipant);
  }
}
