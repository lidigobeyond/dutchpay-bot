import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from '../../database/entities/workspace.entity';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
