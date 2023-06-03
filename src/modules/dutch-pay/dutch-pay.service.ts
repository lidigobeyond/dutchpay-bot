import { Injectable } from '@nestjs/common';
import { DutchPayEntity } from './entities/dutch-pay.entity';
import { Repository } from 'typeorm';
import { ParticipantEntity } from './entities/participant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DutchPayService {
  constructor(
    @InjectRepository(DutchPayEntity) private readonly dutchPayRepository: Repository<DutchPayEntity>,
    @InjectRepository(ParticipantEntity) private readonly participantRepository: Repository<ParticipantEntity>,
  ) {}

  /**
   * 더치 페이 정보를 조회합니다.
   * @param id
   */
  get(id: number): Promise<DutchPayEntity | null> {
    return this.dutchPayRepository.findOne({
      relations: {
        participants: true,
      },
      where: { id },
    });
  }

  /**
   * 더치 페이 정보를 저장합니다.
   * @param args
   */
  async create(args: {
    title: string;
    date: Date;
    description?: string;
    participants: { userId: string; price: string }[];
    createUserId: string;
  }): Promise<DutchPayEntity> {
    const { title, date, description, createUserId } = args;

    const participants = this.participantRepository.create(args.participants);

    const dutchPay = this.dutchPayRepository.create({
      title,
      date,
      description,
      participants,
      createUserId,
    });

    return await this.dutchPayRepository.save(dutchPay);
  }

  /**
   * 더치 페이 정보를 수정합니다.
   * @param dutchPay
   */
  async update(dutchPay: DutchPayEntity): Promise<DutchPayEntity> {
    return this.dutchPayRepository.save(dutchPay);
  }
}
