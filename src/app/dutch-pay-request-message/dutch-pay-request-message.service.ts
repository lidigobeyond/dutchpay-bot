import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../modules/slack/slack.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../../modules/dutch-pay/entities/participant.entity';
import { PARTICIPANT_PAID_BACK_EVENT } from '../app.constant';

@Injectable()
export class DutchPayRequestMessageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(ParticipantEntity) private readonly participantRepository: Repository<ParticipantEntity>,
  ) {}

  /**
   * 입금 완료 이벤트 처리 함수
   * @param blockActionPayload
   */
  async handlePaidBack(blockActionPayload: BlockActionsPayload): Promise<void> {
    const { user, message } = blockActionPayload;

    // 참여자 정보 조회
    const participant = await this.participantRepository.findOneBy({
      userId: user.id,
      ts: message!.ts,
    });

    if (!participant) {
      throw new Error('참여자 정보가 없습니다!');
    }

    // 입금 완료 여부를 '완료'로 변경
    participant.isPayBack = true;

    await this.participantRepository.save(participant);

    // 입금 완료 이벤트 발행
    this.eventEmitter.emit(PARTICIPANT_PAID_BACK_EVENT, participant.id);
  }
}
