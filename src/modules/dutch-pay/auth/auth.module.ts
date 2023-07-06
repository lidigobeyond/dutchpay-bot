import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SlackModule } from '../../../slack/slack.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workspace } from '../../../database/entities/workspace.entity';

@Module({
  imports: [SlackModule, TypeOrmModule.forFeature([Workspace])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
