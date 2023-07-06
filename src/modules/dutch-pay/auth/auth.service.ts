import { Injectable, Logger } from '@nestjs/common';
import { SlackService } from '../../../slack/slack.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Workspace } from '../../../database/entities/workspace.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly slackService: SlackService,
    @InjectRepository(Workspace) private readonly workspaceRepository: Repository<Workspace>,
  ) {}

  /**
   * 임시 토큰으로 영구 토큰을 발급받고 저장합니다.
   * @param tempToken
   */
  async getAndSaveToken(tempToken: string): Promise<void> {
    // 임시 토큰으로 영구 토큰을 발급받습니다.
    const response = await this.slackService.access(tempToken);

    if (!response.ok) {
      // TODO 예외 처리
      throw new Error();
    }

    // 워크스페이스 정보와 토큰 정보를 저장합니다.
    const workspaceEntity = this.workspaceRepository.create({
      id: response.team!.id,
      token: response.access_token,
      tokenType: response.token_type,
      scope: response.scope,
      botUserId: response.bot_user_id,
      appId: response.app_id,
    });

    await this.workspaceRepository.save(workspaceEntity);
  }
}
