import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { ParticipantEntity } from './participant.entity';

@Entity()
export class DutchPayEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '슬랙 메시지 타임스탬프\n' + '슬랙 메시지를 수정하거나 삭제할 때 필요함.',
  })
  ts?: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '제목',
  })
  title: string;

  @Column({
    type: 'date',
    comment: '날짜',
  })
  date: Date;

  @Column({
    type: 'text',
    nullable: true,
    comment: '내용',
  })
  description?: string;

  @OneToMany(() => ParticipantEntity, (participant) => participant.dutchPay, {
    cascade: true,
  })
  participants: ParticipantEntity[];

  @Column({
    type: 'boolean',
    default: false,
    comment: '완료 여부',
  })
  isFinished: boolean;

  @Index()
  @Column({
    type: 'varchar',
    length: 255,
    comment: '생성한 유저 ID',
  })
  createUserId: string;

  @CreateDateColumn({
    comment: '생성 일시',
  })
  createdAt: Date;

  @UpdateDateColumn({ comment: '수정 일시' })
  updatedAt: Date;
}
