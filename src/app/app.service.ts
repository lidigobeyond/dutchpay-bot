import { Injectable, Logger } from '@nestjs/common';
import { DutchPayModal } from './dutch-pay-modal/dto/dutch-pay-modal.dto';
import { SlackService } from '../modules/slack/slack.service';
import { DutchPayCreatedMessage } from './dutch-pay-created-message/dto/dutch-pay-created-message.dto';
import dayjs from 'dayjs';
import { DutchPayRequestMessage } from './dutch-pay-request-message/dto/dutch-pay-request-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DutchPayEntity } from '../modules/dutch-pay/entities/dutch-pay.entity';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../modules/dutch-pay/entities/participant.entity';

@Injectable()
export class AppService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    @InjectRepository(DutchPayEntity) private readonly dutchPayRepository: Repository<DutchPayEntity>,
    @InjectRepository(ParticipantEntity) private readonly participantRepository: Repository<ParticipantEntity>,
  ) {}

  /**
   * 사용자에게 새로운 더치 페이 생성 모달을 엽니다.
   * @param args
   */
  async openNewDutchPayModal(args: { triggerId: string; title?: string }): Promise<void> {
    const { triggerId, title } = args;

    const dutchPayModal = new DutchPayModal({ title });

    await this.slackService.openModal(triggerId, dutchPayModal);
  }

  /**
   * 더치 페이 참여자들에게 더치 페이 요청 메시지를 보냅니다.
   * @param dutchPayId
   */
  async sendDutchPayRequestMessage(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPayEntity = await this.dutchPayRepository.findOne({
      where: {
        id: dutchPayId,
      },
      relations: {
        participants: true,
      },
    });

    if (!dutchPayEntity) {
      // TODO: 예외 처리
      throw new Error();
    }

    const { createUserId, title, date, description } = dutchPayEntity;

    for (let i = 0; i < dutchPayEntity.participants.length; i++) {
      const { userId: participantId, price, isPayBack } = dutchPayEntity.participants[i];

      // 더치 페이 요청 메시지 발송
      const response = await this.slackService.postMessage({
        channelId: participantId,
        text: `<@${createUserId}> 님께서 더치 페이를 요청하셨습니다.`,
        message: new DutchPayRequestMessage({
          createUserId,
          title,
          date: dayjs(date),
          description,
          price,
          isPayBack,
        }),
      });

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }

      // 더치 페이 요청 메시지 정보 저장
      dutchPayEntity.participants[i].channelId = response.channel!;
      dutchPayEntity.participants[i].ts = response.ts!;
    }

    await this.dutchPayRepository.save(dutchPayEntity);
  }

  /**
   * 더치 페이를 생성한 유저에게 더치 페이 생성 완료 메시지를 보냅니다.
   * @param dutchPayId
   */
  async sendDutchPayCreatedMessage(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPayEntity = await this.dutchPayRepository.findOne({
      where: {
        id: dutchPayId,
      },
      relations: {
        participants: true,
      },
    });

    if (!dutchPayEntity) {
      // TODO: 예외 처리
      throw new Error();
    }

    const { createUserId, title, date, description, participants } = dutchPayEntity;

    // 더치 페이 생성 완료 메시지 발송
    const response = await this.slackService.postMessage({
      channelId: createUserId,
      text: '더치 페이가 생성되었습니다.',
      message: new DutchPayCreatedMessage({
        title,
        date: dayjs(date),
        description,
        participants,
      }),
    });

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 더치 페이 생성 완료 메시지 정보 저장
    dutchPayEntity.channelId = response.channel!;
    dutchPayEntity.ts = response.ts!;

    await this.dutchPayRepository.save(dutchPayEntity);
  }

  /**
   * 참여자가 입금 완료했을 때 발생하는 이벤트를 처리합니다.
   * @param participantId
   */
  async handleParticipantPaidBack(participantId: number): Promise<void> {
    // 참여자와 참여자가 참여하고 있는 더치 페이 정보 조회
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
      relations: { dutchPay: { participants: true } },
    });

    if (!participant) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 더치 페이 참여자에게 발송했던 더치 페이 요청 메시지 수정
    await this.updateDutchPayRequestMessage(participant);
    // 더치 페이를 생성한 유저에게 발송했던 더치 페이 생성 완료 메시지 수정
    await this.updateDutchPayCreatedMessage(participant.dutchPay);
    // 더치 페이를 생성한 유저에게 입금 완료 안내 메시지 발송
    await this.sendParticipantPaidBackMessage(participant);
  }

  /**
   * 더치 페이 참여자에게 발송했던 더치 페이 요청 메시지를 수정합니다.
   * @param participant
   */
  updateDutchPayRequestMessage(participant: ParticipantEntity) {
    const { channelId, ts, price, isPayBack, dutchPay } = participant;
    const { createUserId, title, date, description } = dutchPay;

    return this.slackService.updateMessage({
      channelId,
      ts,
      text: `<@${createUserId}> 님께서 더치 페이를 요청하셨습니다.`,
      message: new DutchPayRequestMessage({
        createUserId,
        title,
        date: dayjs(date),
        description,
        price,
        isPayBack,
      }),
    });
  }

  /**
   * 더치 페이를 생성한 유저에게 발송했던 더치 페이 생성 완료 메시지를 수정합니다.
   * @param dutchPay
   */
  updateDutchPayCreatedMessage(dutchPay: DutchPayEntity) {
    const { channelId, ts, title, date, description, participants } = dutchPay;

    return this.slackService.updateMessage({
      channelId,
      ts,
      text: '더치 페이가 생성되었습니다.',
      message: new DutchPayCreatedMessage({
        title,
        date: dayjs(date),
        description,
        participants,
      }),
    });
  }

  /**
   * 더치 페이를 생성한 유저에게 입금 완료 메시지를 보냅니다.
   * @param participant
   */
  sendParticipantPaidBackMessage(participant: ParticipantEntity) {
    const { userId: participantId, dutchPay } = participant;
    const { createUserId } = dutchPay;

    return this.slackService.postMessage({
      channelId: createUserId,
      text: `<@${participantId}> 님께서 입금 완료하셨다고 합니다. 입금 내역을 확인해보세요.`,
    });
  }
}
