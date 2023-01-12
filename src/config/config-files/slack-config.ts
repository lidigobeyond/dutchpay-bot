import { registerAs } from '@nestjs/config';
import { Expose, plainToInstance } from 'class-transformer';
import { IsNotEmpty, IsString, validateSync } from 'class-validator';

export class SlackConfig {
  @Expose({ name: 'SLACK_BOT_USER_OAUTH_TOKEN' })
  @IsNotEmpty()
  @IsString()
  token: string;
}

export const slackConfig = registerAs('slack', () => {
  const obj = plainToInstance(SlackConfig, process.env, { excludeExtraneousValues: true, exposeDefaultValues: true });

  const errors = validateSync(obj, { skipMissingProperties: false });
  if (errors.length) {
    throw new Error(errors.toString());
  }

  return obj;
});
