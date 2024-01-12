import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Workspace {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    comment: '아이디',
  })
  id: number;

  @Column({
    type: 'varchar',
    length: 127,
    comment: '워크스페이스 아이디',
    unique: true,
  })
  teamId: string;

  @Column({
    type: 'varchar',
    length: 255,
    comment: '엑세스 토큰',
  })
  token: string;

  // 참고 : https://api.slack.com/authentication/token-types
  @Column({
    type: 'varchar',
    length: 255,
    comment: '제목',
  })
  tokenType: string;

  // 참고 : https://api.slack.com/scopes
  @Column({
    type: 'text',
    comment: '앱에 허용된 권한 목록 (콤마(,)로 나눠져있음)',
  })
  scope: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  botUserId?: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  appId?: string;

  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
    comment: '생성일시',
  })
  createdAt: Date;
}
