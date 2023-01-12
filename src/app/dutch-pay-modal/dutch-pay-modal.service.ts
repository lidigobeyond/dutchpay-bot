import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../modules/slack/slack.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DutchPayModal } from './dto/dutch-pay-modal.dto';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../modules/slack/types/payloads/view-submission-payload';
import dayjs from 'dayjs';
import { DutchPayService } from '../../modules/dutch-pay/dutch-pay.service';
import { DUTCH_PAY_CREATED_EVENT } from '../app.constant';

@Injectable()
export class DutchPayModalService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
    private readonly dutchPayService: DutchPayService,
  ) {}

  /**
   * 사용자가 더치 페이 생성 모달에서 참여자를 추가했을 때 발생하는 이벤트를 처리합니다.
   * @param blockActionsPayload
   */
  async handleUserSelected(blockActionsPayload: BlockActionsPayload): Promise<void> {
    const { view, actions } = blockActionsPayload;

    if (!view) {
      // TODO: 예외처리 로직
      throw new Error('');
    }

    // 모달 상태 정보 추출
    const dutchPayModal = DutchPayModal.fromViewState(view.state);

    // 선택된 사용자 아이디 추출
    const selectedUserId = (actions[0] as any).selected_conversation;

    // 선택된 사용자를 참여자 목록에 추가
    dutchPayModal.addParticipant({ id: selectedUserId });

    // 모달 업데이트
    await this.slackService.updateModal(view.id, dutchPayModal);
  }

  /**
   * 사용자가 더치 페이 생성 모달에서 생성 버튼을 눌렀을 때 발생하는 이벤트 처리 함수
   * @param viewSubmissionPayload
   */
  async handleViewSubmission(viewSubmissionPayload: ViewSubmissionPayload): Promise<void> {
    const { user, view } = viewSubmissionPayload;

    // 모달 상태 정보 추출
    const dutchPayModal = DutchPayModal.fromViewState(view.state);

    // 더치 페이 정보 저장
    const { title, date, description, participants } = dutchPayModal;

    const dutchPayEntity = await this.dutchPayService.create({
      title: title as string,
      date: (date as dayjs.Dayjs).toDate(),
      description,
      participants: participants.map((participant) => {
        const { id, price } = participant;
        return {
          userId: id,
          price: price as string,
        };
      }),
      createUserId: user.id,
    });

    // 더치 페이 생성 이벤트 발행
    this.eventEmitter.emit(DUTCH_PAY_CREATED_EVENT, dutchPayEntity.id);
  }
}
