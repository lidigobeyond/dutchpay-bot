import { Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Participant } from './participant.entity';

@Index(['createUserTeamId', 'createUserId'])
@Entity()
export class Dutchpay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '슬랙 메시지가 발송된 채널 ID\n' + '슬랙 메시지를 수정하거나 삭제할 때 필요함.',
  })
  channelId: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '슬랙 메시지 타임스탬프\n' + '슬랙 메시지를 수정하거나 삭제할 때 필요함.',
  })
  ts: string;

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

  @OneToMany(() => Participant, (participant) => participant.dutchpay, {
    cascade: true,
  })
  participants: Participant[];

  @Column({
    type: 'boolean',
    default: false,
    comment: '삭제 여부',
  })
  isDeleted: boolean;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '생성한 유저 속한 팀(=워크스페이스) ID',
  })
  createUserTeamId: string;

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
