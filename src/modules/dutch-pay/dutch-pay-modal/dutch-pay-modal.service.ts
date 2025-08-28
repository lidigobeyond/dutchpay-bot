import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../../slack/slack.service';
import { DutchPayModal } from './dto/dutch-pay-modal.dto';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';
import { ViewSubmissionPayload } from '../../../slack/types/payloads/view-submission-payload';
import dayjs from 'dayjs';
import { DUTCH_PAY_CREATED_EVENT } from '../dutch-pay.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { Dutchpay } from '../../../database/entities/dutchpay.entity';
import { Repository } from 'typeorm';
import { Participant } from '../../../database/entities/participant.entity';
import { CustomEventEmitter } from '../../../event-emitter/event-emitter.service';

@Injectable()
export class DutchPayModalService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly customEventEmitter: CustomEventEmitter,
    @InjectRepository(Dutchpay) private readonly dutchpayRepository: Repository<Dutchpay>,
    @InjectRepository(Participant) private readonly participantRepository: Repository<Participant>,
  ) {}

  /**
   * 사용자가 더치페이 생성 모달에서 참여자를 추가했을 때 발생하는 이벤트를 처리합니다.
   * @param blockActionsPayload
   */
  async handleUserSelectedEvent(blockActionsPayload: BlockActionsPayload): Promise<void> {
    const { team, view, actions } = blockActionsPayload;

    // 모달 상태 정보 추출
    const dutchPayModal = DutchPayModal.fromViewState(view!.state);

    // 선택된 사용자 아이디 추출
    const selectedUserId = (actions[0] as any).selected_conversation;

    // 선택된 사용자를 참여자 목록에 추가
    dutchPayModal.addParticipant({ id: selectedUserId });

    // 모달 업데이트
    await this.slackService.updateModal({
      teamId: team.id,
      viewId: view!.id,
      modal: dutchPayModal,
    });
  }

  /**
   * 사용자가 더치페이 생성 모달에서 생성 버튼을 눌렀을 때 발생하는 이벤트 처리 함수
   * @param viewSubmissionPayload
   */
  async handleViewSubmissionEvent(viewSubmissionPayload: ViewSubmissionPayload): Promise<void> {
    const { team, user, view } = viewSubmissionPayload;

    // 모달에서 더치페이 정보 추출
    const dutchPayModal = DutchPayModal.fromViewState(view.state);

    const title = dutchPayModal.title as string;
    const date = dutchPayModal.date as dayjs.Dayjs;
    const description = dutchPayModal.description;
    const participantIdAndPriceList = dutchPayModal.participants as { id: string; price: string }[];

    // 더치페이 정보 저장
    const participants = participantIdAndPriceList.map((participant) => {
      const { id: userId, price } = participant;
      return this.participantRepository.create({
        teamId: team.id,
        userId,
        price,
      });
    });

    const dutchpay = this.dutchpayRepository.create({
      title,
      date: date.toDate(),
      description,
      participants,
      createUserTeamId: team.id,
      createUserId: user.id,
    });

    await this.dutchpayRepository.save(dutchpay);

    // 더치페이 생성 완료 이벤트 발행
    this.customEventEmitter.emit(DUTCH_PAY_CREATED_EVENT, dutchpay.id);
  }
}
