import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DutchPayEntity } from './dutch-pay.entity';

@Entity()
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '참여자 유저 ID',
  })
  userId: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '금액',
  })
  price: string;

  @Column({
    type: 'boolean',
    default: false,
    comment: '입금 완료 여부',
  })
  isPayBack: boolean;

  @ManyToOne(() => DutchPayEntity, (dutchpay) => dutchpay.participants)
  dutchPay: DutchPayEntity;
}
