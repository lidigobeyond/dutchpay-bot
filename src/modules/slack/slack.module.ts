import { Module } from '@nestjs/common';
import { SlackService } from './slack.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from '../../database/entities/workspace.entity';
import { CustomConfigModule } from '../../config/custom-config.module';

@Module({
  imports: [CustomConfigModule, TypeOrmModule.forFeature([WorkspaceEntity])],
  providers: [SlackService],
  exports: [SlackService],
})
export class SlackModule {}
