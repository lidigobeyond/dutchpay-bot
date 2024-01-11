import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthListener } from './auth.listener';
import { AuthService } from './auth.service';
import { SlackModule } from '../../../slack/slack.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from '../../../database/entities/workspace.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([Workspace])],
  controllers: [AuthController],
  providers: [AuthListener, AuthService],
})
export class AuthModule {}
