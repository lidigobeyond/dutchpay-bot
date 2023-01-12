import { Inject, Injectable } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { appConfig } from './config-files/app-config';
import { slackConfig } from './config-files/slack-config';
import { databaseConfig } from './config-files/database-config';

@Injectable()
export class CustomConfigService extends ConfigService {
  @Inject(appConfig.KEY) public readonly appConfig: ConfigType<typeof appConfig>;
  @Inject(slackConfig.KEY) public readonly slackConfig: ConfigType<typeof slackConfig>;
  @Inject(databaseConfig.KEY) public readonly databaseConfig: ConfigType<typeof databaseConfig>;
}
