import { DynamicModule, ForwardReference, Module, Type } from '@nestjs/common';
import { SlackService } from './slack.service';
import { SLACK_CONFIG } from './slack.constant';
import { ConfigService } from '@nestjs/config';

export interface SlackConfig {
  token: string;
}

export interface SlackAsyncConfig {
  imports?: Array<
    Type<any> | DynamicModule | Promise<DynamicModule> | ForwardReference
  >;
  inject?: any[];
  useFactory: (...args: any[]) => Promise<SlackConfig> | SlackConfig;
  isGlobal: boolean;
}

@Module({
  imports: [
    SlackModule.registerAsync({
      imports: [],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          token: configService.get<string>('SLACK_WEB_API_TOKEN', ''),
        };
      },
      isGlobal: true,
    }),
  ],
})
export class SlackModule {
  static registerAsync({
    imports = [],
    inject = [],
    useFactory,
    isGlobal,
  }: SlackAsyncConfig): DynamicModule {
    return {
      module: SlackModule,
      imports: [...imports],
      providers: [
        {
          provide: SLACK_CONFIG,
          useFactory,
          inject,
        },
        SlackService,
      ],
      exports: [SlackService],
      global: isGlobal,
    };
  }
}
