import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Env } from './config.model';
import { appConfig } from './config-files/app-config';
import { slackConfig } from './config-files/slack-config';
import { databaseConfig } from './config-files/database-config';
import { CustomConfigService } from './custom-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env'],
      ignoreEnvFile: process.env.APP_ENV === Env.prod,
      load: [appConfig, slackConfig, databaseConfig],
    }),
  ],
  providers: [CustomConfigService],
  exports: [CustomConfigService],
})
export class CustomConfigModule {}
