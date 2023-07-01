import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../modules/slack/slack.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DutchPayEntity } from '../../database/entities/dutch-pay.entity';
import { BlockActionsPayload } from '../../modules/slack/types/payloads/block-actions-payload';
import { DUTCH_PAY_DELETED_EVENT } from '../app.constant';

@Injectable()
export class DutchPayCreatedMessageService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(DutchPayEntity) private readonly dutchPayEntityRepository: Repository<DutchPayEntity>,
  ) {}

  /**
   * 더치 페이 삭제 요청 이벤트 처리 함수
   * @param blockActionPayload
   */
  async handleDeleteDutchPay(blockActionPayload: BlockActionsPayload): Promise<void> {
    const { team, user, message } = blockActionPayload;

    // 더치 페이 정보 조회
    const dutchPay = await this.dutchPayEntityRepository.findOneBy({
      createUserTeamId: team.id,
      createUserId: user.id,
      ts: message!.ts,
    });

    if (!dutchPay) {
      throw new Error('더치 페이 정보가 없습니다!');
    }

    // 더치 페이 삭제 처리
    dutchPay.isDeleted = true;

    await this.dutchPayEntityRepository.save(dutchPay);

    // 더치 페이 삭제 이벤트 발행
    this.eventEmitter.emit(DUTCH_PAY_DELETED_EVENT, dutchPay.id);
  }
}
