import { Injectable, Logger } from '@nestjs/common';
import { DutchPayModal } from './dutch-pay-modal/dto/dutch-pay-modal.dto';
import { SlackService } from '../../slack/slack.service';
import { DutchPayCreatedMessage } from './dutch-pay-created-message/dto/dutch-pay-created-message.dto';
import dayjs from 'dayjs';
import { DutchPayRequestMessage } from './dutch-pay-request-message/dto/dutch-pay-request-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Dutchpay } from '../../database/entities/dutchpay.entity';
import { Repository } from 'typeorm';
import { Participant } from '../../database/entities/participant.entity';
import { DutchPayHomeTab } from './dutch-pay-home-tab/dto/dutch-pay-home-tab.dto';

@Injectable()
export class DutchPayService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    @InjectRepository(Dutchpay) private readonly dutchpayRepository: Repository<Dutchpay>,
    @InjectRepository(Participant) private readonly participantRepository: Repository<Participant>,
  ) {}

  /**
   * 사용자에게 새로운 더치페이 생성 모달을 엽니다.
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
   * 더치페이 생성 이벤트를 처리합니다.
   * @param dutchpayId
   */
  async handleDutchPayCreated(dutchpayId: number): Promise<void> {
    // 더치페이 정보 조회
    const dutchpay = await this.dutchpayRepository.findOne({
      where: {
        id: dutchpayId,
      },
      relations: {
        participants: { dutchpay: true },
      },
    });

    if (!dutchpay) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 모든 참여자에게 더치페이 요청 메시지 발송
    for (const participant of dutchpay.participants) {
      const response = await this.sendDutchPayRequestMessage(participant);

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }

      participant.channelId = response.channel!;
      participant.ts = response.ts!;
    }

    // 더치페이를 생성한 유저에게 더치페이 생성 완료 메시지 발송
    const response = await this.sendDutchPayCreatedMessage(dutchpay);

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }

    dutchpay.channelId = response.channel!;
    dutchpay.ts = response.ts!;

    // 발송한 메시지 정보 저장
    await this.dutchpayRepository.save(dutchpay);
  }

  /**
   * 더치페이 참여자들에게 더치페이 요청 메시지를 보냅니다.
   * @param participant
   */
  sendDutchPayRequestMessage(participant: Participant) {
    const { teamId, userId: participantId, price, isPayBack, dutchpay } = participant;
    const { createUserId, title, date, description, isDeleted: isDutchpayDeleted } = dutchpay;

    // 더치페이 요청 메시지 발송
    return this.slackService.postMessage({
      teamId,
      channelId: participantId,
      text: `<@${createUserId}> 님께서 더치페이를 요청하셨습니다.`,
      message: new DutchPayRequestMessage({
        createUserId,
        title,
        date: dayjs(date),
        description,
        isDutchPayDeleted: isDutchpayDeleted,
        price,
        isPayBack,
      }),
    });
  }

  /**
   * 더치페이를 생성한 유저에게 더치페이 생성 완료 메시지를 보냅니다.
   * @param dutchpay
   */
  sendDutchPayCreatedMessage(dutchpay: Dutchpay) {
    const { createUserTeamId, createUserId, title, date, description, participants, isDeleted } = dutchpay;

    // 더치페이 생성 완료 메시지 발송
    return this.slackService.postMessage({
      teamId: createUserTeamId,
      channelId: createUserId,
      text: '더치페이가 생성되었습니다.',
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
    // 참여자와 참여자가 참여하고 있는 더치페이 정보 조회
    const participant = await this.participantRepository.findOne({
      where: { id: participantId },
      relations: { dutchpay: { participants: true } },
    });

    if (!participant) {
      // TODO: 예외 처리
      throw new Error();
    }

    // 더치페이 참여자에게 발송했던 더치페이 요청 메시지 수정
    await this.updateDutchPayRequestMessage(participant);
    // 더치페이를 생성한 유저에게 발송했던 더치페이 생성 완료 메시지 수정
    await this.updateDutchPayCreatedMessage(participant.dutchpay);
    // 더치페이를 생성한 유저에게 입금 완료 안내 메시지 발송
    await this.sendParticipantPaidBackMessage(participant);

    // 모든 더치페이 참여자가 입금 완료한 경우
    const everyParticipantsPaidBack = participant.dutchpay.participants.every((participant) => participant.isPayBack);
    if (everyParticipantsPaidBack) {
      // 더치페이를 생성한 유저에게 더치페이 완료 메시지 발송
      await this.sendDutchPayFinishedMessage(participant.dutchpay);
    }
  }

  /**
   * 더치페이 참여자에게 발송했던 더치페이 요청 메시지를 수정합니다.
   * @param participant
   */
  updateDutchPayRequestMessage(participant: Participant) {
    const { teamId, channelId, ts, price, isPayBack, dutchpay } = participant;
    const { createUserId, title, date, description, isDeleted: isDutchpayDeleted } = dutchpay;

    return this.slackService.updateMessage({
      teamId,
      channelId,
      ts,
      text: `<@${createUserId}> 님께서 더치페이를 요청하셨습니다.`,
      message: new DutchPayRequestMessage({
        createUserId,
        title,
        date: dayjs(date),
        description,
        isDutchPayDeleted: isDutchpayDeleted,
        price,
        isPayBack,
      }),
    });
  }

  /**
   * 더치페이를 생성한 유저에게 발송했던 더치페이 생성 완료 메시지를 수정합니다.
   * @param dutchpay
   */
  updateDutchPayCreatedMessage(dutchpay: Dutchpay) {
    const { createUserTeamId, channelId, ts, title, date, description, participants, isDeleted } = dutchpay;

    return this.slackService.updateMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: '더치페이가 생성되었습니다.',
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
   * 더치페이를 생성한 유저에게 입금 완료 메시지를 보냅니다.
   * @param participant
   */
  sendParticipantPaidBackMessage(participant: Participant) {
    const { userId: participantId, dutchpay } = participant;
    const { createUserTeamId, channelId, ts } = dutchpay;

    return this.slackService.replyMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: `<@${participantId}> 님께서 입금 완료하셨다고 합니다. 입금 내역을 확인해보세요.`,
    });
  }

  /**
   * 더치페이를 생성한 유저에게 더치페이 완료 메시지를 보냅니다.
   * @param dutchpay
   */
  sendDutchPayFinishedMessage(dutchpay: Dutchpay) {
    const { createUserTeamId, channelId, ts, createUserId } = dutchpay;

    return this.slackService.replyMessage({
      teamId: createUserTeamId,
      channelId,
      ts,
      text: `<@${createUserId}> 님, 모든 참여자들이 입금 완료하셨습니다. 입금 내역을 확인해보세요.`,
    });
  }

  /**
   * 더치페이 삭제 이벤트를 처리합니다.
   * @param dutchpayId
   */
  async handleDutchPayDeleted(dutchpayId: number): Promise<void> {
    // 더치페이 정보 조회
    const dutchpay = await this.dutchpayRepository.findOne({
      where: {
        id: dutchpayId,
      },
      relations: {
        participants: { dutchpay: true },
      },
    });

    if (!dutchpay) {
      // TODO: 예외 처리
      throw new Error();
    }

    for (const participant of dutchpay.participants) {
      // 더치페이 참여자에게 발송했던 더치페이 요청 메시지 수정
      const response = await this.updateDutchPayRequestMessage(participant);

      if (!response.ok) {
        // TODO: 예외 처리
        throw new Error();
      }
    }

    // 더치페이를 생성한 유저에게 발송했던 더치페이 생성 완료 메시지 수정
    const response = await this.updateDutchPayCreatedMessage(dutchpay);

    if (!response.ok) {
      // TODO: 예외 처리
      throw new Error();
    }
  }

  /**
   * 입금 완료하지 않은 더치페이 참여자에게 리마인드 메시지를 보냅니다.
   */
  async sendRemindMessage(): Promise<void> {
    this.logger.log(`리마인드 메시지 발송 시작`);

    // 입금 완료하지 않은 더치페이 참여자 목록 조회
    const participants = await this.participantRepository.findBy({
      isPayBack: false,
      dutchpay: {
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
