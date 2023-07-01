import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SlackModule } from '../../modules/slack/slack.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceEntity } from '../../database/entities/workspace.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([WorkspaceEntity])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
