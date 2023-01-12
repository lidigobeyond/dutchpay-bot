import { registerAs } from '@nestjs/config';
import { Expose, plainToInstance, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, validateSync } from 'class-validator';
import { Env } from '../config.model';

export class AppConfig {
  @Expose({ name: 'APP_NAME' })
  @IsOptional()
  @IsString()
  appName = 'dutch-pay-bot';

  @Expose({ name: 'APP_ENV' })
  @IsEnum(Env)
  env: Env = Env.local;

  @Expose({ name: 'APP_PORT' })
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  port = 3000;
}

export const appConfig = registerAs('app', () => {
  const obj = plainToInstance(AppConfig, process.env, { excludeExtraneousValues: true, exposeDefaultValues: true });

  const errors = validateSync(obj, { skipMissingProperties: false });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return obj;
});
