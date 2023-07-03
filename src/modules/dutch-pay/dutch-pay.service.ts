import { Injectable, Logger } from '@nestjs/common';
import { DutchPayModal } from './dutch-pay-modal/dto/dutch-pay-modal.dto';
import { SlackService } from '../../slack/slack.service';
import { DutchPayCreatedMessage } from './dutch-pay-created-message/dto/dutch-pay-created-message.dto';
import dayjs from 'dayjs';
import { DutchPayRequestMessage } from './dutch-pay-request-message/dto/dutch-pay-request-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DutchPayEntity } from '../../database/entities/dutch-pay.entity';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../../database/entities/participant.entity';
import { DutchPayHomeTab } from './dutch-pay-home-tab/dto/dutch-pay-home-tab.dto';

@Injectable()
export class DutchPayService {
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
  async openNewDutchPayModal(args: { teamId: string; triggerId: string; title?: string }): Promise<void> {
    const { teamId, triggerId, title } = args;

    const dutchPayModal = new DutchPayModal({ title });

    await this.slackService.openModal({
      teamId,
      triggerId,
      modal: dutchPayModal,
    });
  }

  /**
   * 사용자에게 새로운 Home 탭을 엽니다.
   * @param args
   */
  async openNewHomeTab(args: { teamId: string; userId: string }): Promise<void> {
    const { teamId, userId } = args;

    const dutchPayHome = new DutchPayHomeTab();

    await this.slackService.publishHome({ teamId, userId, home: dutchPayHome });
  }

  /**
   * 더치 페이 생성 이벤트를 처리합니다.
   * @param dutchPayId
   */
  async handleDutchPayCreated(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPay = await this.dutchPayRepository.findOne({
      where: {
        id: dutchPayId,
      },
      relations: {
        participants: { dutchPay: true },
      },
    });

    if (!dutchPay) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 모든 참여자에게 더치 페이 요청 메시지 발송
    for (const participant of dutchPay.participants) {
      const response = await this.sendDutchPayRequestMessage(participant);

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }

      participant.channelId = response.channel!;
      participant.ts = response.ts!;
    }

    // 더치 페이를 생성한 유저에게 더치 페이 생성 완료 메시지 발송
    const response = await this.sendDutchPayCreatedMessage(dutchPay);

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }

    dutchPay.channelId = response.channel!;
    dutchPay.ts = response.ts!;

    // 발송한 메시지 정보 저장
    await this.dutchPayRepository.save(dutchPay);
  }

  /**
   * 더치 페이 참여자들에게 더치 페이 요청 메시지를 보냅니다.
   * @param participant
   */
  sendDutchPayRequestMessage(participant: ParticipantEntity) {
    const { teamId, userId: participantId, price, isPayBack, dutchPay } = participant;
    const { createUserId, title, date, description, isDeleted: isDutchPayDeleted } = dutchPay;

    // 더치 페이 요청 메시지 발송
    return this.slackService.postMessage({
      teamId,
      channelId: participantId,
      text: `<@${createUserId}> 님께서 더치 페이를 요청하셨습니다.`,
      message: new DutchPayRequestMessage({
        createUserId,
        title,
        date: dayjs(date),
        description,
        isDutchPayDeleted,
        price,
        isPayBack,
      }),
    });
  }

  /**
   * 더치 페이를 생성한 유저에게 더치 페이 생성 완료 메시지를 보냅니다.
   * @param dutchPay
   */
  sendDutchPayCreatedMessage(dutchPay: DutchPayEntity) {
    const { createUserTeamId, createUserId, title, date, description, participants, isDeleted } = dutchPay;

    // 더치 페이 생성 완료 메시지 발송
    return this.slackService.postMessage({
      teamId: createUserTeamId,
      channelId: createUserId,
      text: '더치 페이가 생성되었습니다.',
      message: new DutchPayCreatedMessage({
        title,
        date: dayjs(date),
        description,
        participants,
        isDeleted,
      }),
    });
  }

  /**
   * 입금 완료 이벤트를 처리합니다.
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

    // 모든 더치 페이 참여자가 입금 완료한 경우
    const everyParticipantsPaidBack = participant.dutchPay.participants.every((participant) => participant.isPayBack);
    if (everyParticipantsPaidBack) {
      // 더치 페이를 생성한 유저에게 더치 페이 완료 메시지 발송
      await this.sendDutchPayFinishedMessage(participant.dutchPay);
    }
  }

  /**
   * 더치 페이 참여자에게 발송했던 더치 페이 요청 메시지를 수정합니다.
   * @param participant
   */
  updateDutchPayRequestMessage(participant: ParticipantEntity) {
    const { teamId, channelId, ts, price, isPayBack, dutchPay } = participant;
    const { createUserId, title, date, description, isDeleted: isDutchPayDeleted } = dutchPay;

    return this.slackService.updateMessage({
      teamId,
      channelId,
      ts,
      text: `<@${createUserId}> 님께서 더치 페이를 요청하셨습니다.`,
      message: new DutchPayRequestMessage({
        createUserId,
        title,
        date: dayjs(date),
        description,
        isDutchPayDeleted,
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
    const { createUserTeamId, channelId, ts, title, date, description, participants, isDeleted } = dutchPay;

    return this.slackService.updateMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: '더치 페이가 생성되었습니다.',
      message: new DutchPayCreatedMessage({
        title,
        date: dayjs(date),
        description,
        participants,
        isDeleted,
      }),
    });
  }

  /**
   * 더치 페이를 생성한 유저에게 입금 완료 메시지를 보냅니다.
   * @param participant
   */
  sendParticipantPaidBackMessage(participant: ParticipantEntity) {
    const { userId: participantId, dutchPay } = participant;
    const { createUserTeamId, channelId, ts } = dutchPay;

    return this.slackService.replyMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: `<@${participantId}> 님께서 입금 완료하셨다고 합니다. 입금 내역을 확인해보세요.`,
    });
  }

  /**
   * 더치 페이를 생성한 유저에게 더치 페이 완료 메시지를 보냅니다.
   * @param dutchPay
   */
  sendDutchPayFinishedMessage(dutchPay: DutchPayEntity) {
    const { createUserTeamId, channelId, ts, createUserId } = dutchPay;

    return this.slackService.replyMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: `<@${createUserId}> 님, 모든 참여자들이 입금 완료하셨습니다. 입금 내역을 확인해보세요.`,
    });
  }

  /**
   * 더치 페이 삭제 이벤트를 처리합니다.
   * @param dutchPayId
   */
  async handleDutchPayDeleted(dutchPayId: number): Promise<void> {
    // 더치 페이 정보 조회
    const dutchPay = await this.dutchPayRepository.findOne({
      where: {
        id: dutchPayId,
      },
      relations: {
        participants: { dutchPay: true },
      },
    });

    if (!dutchPay) {
      // TODO: 예외 처리
      throw new Error();
    }

    for (const participant of dutchPay.participants) {
      // 더치 페이 참여자에게 발송했던 더치 페이 요청 메시지 수정
      const response = await this.updateDutchPayRequestMessage(participant);

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }
    }

    // 더치 페이를 생성한 유저에게 발송했던 더치 페이 생성 완료 메시지 수정
    const response = await this.updateDutchPayCreatedMessage(dutchPay);

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }
  }

  /**
   * 입금 완료하지 않은 더치 페이 참여자에게 리마인드 메시지를 보냅니다.
   */
  async sendRemindMessage(): Promise<void> {
    this.logger.log(`리마인드 메시지 발송 시작`);

    // 입금 완료하지 않은 더치 페이 참여자 목록 조회
    const participants = await this.participantRepository.findBy({
      isPayBack: false,
      dutchPay: {
        isDeleted: false,
      },
    });

    this.logger.log(`리마인드 메시지 발송 대상자 = ${participants.length}명`);

    // 리마인드 메시지 발송
    for (const participant of participants) {
      const { teamId, userId: participantId, ts } = participant;

      await this.slackService.replyMessage({
        teamId,
        channelId: participantId,
        ts,
        text: `(띵동) <@${participantId}> 님, 입금 완료하셨나요? 입금 완료하셨다면 '입금 완료' 버튼을 눌러주세요.`,
      });
    }

    this.logger.log(`리마인드 메시지 발송 완료!`);
  }
}
