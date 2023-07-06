import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../../slack/slack.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dutchpay } from '../../../database/entities/dutchpay.entity';
import { BlockActionsPayload } from '../../../slack/types/payloads/block-actions-payload';
import { DUTCH_PAY_DELETED_EVENT } from '../dutch-pay.constant';

@Injectable()
export class DutchPayCreatedMessageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Dutchpay) private readonly dutchpayRepository: Repository<Dutchpay>,
  ) {}

  /**
   * 더치페이 삭제 요청 이벤트 처리 함수
   * @param blockActionPayload
   */
  async handleDeleteDutchPayEvent(blockActionPayload: BlockActionsPayload): Promise<void> {
    const { team, user, message } = blockActionPayload;

    // 더치페이 정보 조회
    const dutchpay = await this.dutchpayRepository.findOneBy({
      createUserTeamId: team.id,
      createUserId: user.id,
      ts: message!.ts,
    });

    if (!dutchpay) {
      throw new Error('더치페이 정보가 없습니다!');
    }

    // 더치페이 삭제 처리
    dutchpay.isDeleted = true;

    await this.dutchpayRepository.save(dutchpay);

    // 더치페이 삭제 이벤트 발행
    this.eventEmitter.emit(DUTCH_PAY_DELETED_EVENT, dutchpay.id);
  }
}
