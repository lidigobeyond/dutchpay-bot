import { IModal } from './modal.interface';
import dayjs from 'dayjs';
import { ModalView } from '@slack/web-api';

export class DutchPayModal implements IModal {
  constructor(private title?: string, private datetime?: dayjs.Dayjs, private description?: string) {}

  toModalView(): ModalView {
    return {
      type: 'modal',
      title: {
        type: 'plain_text',
        text: '더치 페이 생성',
        emoji: true,
      },
      submit: {
        type: 'plain_text',
        text: '생성',
        emoji: true,
      },
      close: {
        type: 'plain_text',
        text: '취소',
        emoji: true,
      },
      blocks: [
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            action_id: 'title',
            initial_value: this.title,
            placeholder: {
              type: 'plain_text',
              text: '예) 점심 강남 진해장국',
            },
          },
          label: {
            type: 'plain_text',
            text: '제목',
            emoji: true,
          },
        },
        {
          type: 'input',
          element: {
            type: 'datepicker',
            action_id: 'datetime',
            initial_date: (this.datetime ?? dayjs()).format('YYYY-MM-DD'),
          },
          label: {
            type: 'plain_text',
            text: '날짜',
            emoji: true,
          },
        },
        {
          type: 'input',
          element: {
            type: 'plain_text_input',
            action_id: 'description',
            multiline: true,
            initial_value: this.description,
            placeholder: {
              type: 'plain_text',
              text: '예) 기업은행 김기현 123-467890-12-345 계좌로 임급해주세요!',
            },
          },
          label: {
            type: 'plain_text',
            text: '내용',
            emoji: true,
          },
          optional: true,
        },
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '참여자',
            emoji: true,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'users_select',
              action_id: 'user-select',
              placeholder: {
                type: 'plain_text',
                text: '참여자 추가하기',
                emoji: true,
              },
            },
          ],
        },
      ],
    };
  }
}
