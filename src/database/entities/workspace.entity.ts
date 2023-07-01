import { Column, Entity } from 'typeorm';

@Entity()
export class WorkspaceEntity {
  @Column({
    type: 'varchar',
    length: 127,
    comment: '아이디',
    primary: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    length: 127,
    comment: '이름',
  })
  name: string;

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
    comment: ['앱에 허용된 권한 목록', '콤마(,)로 나눠져있음'].join('\n'),
  })
  scope: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  botUserId: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  appId: string;
}
