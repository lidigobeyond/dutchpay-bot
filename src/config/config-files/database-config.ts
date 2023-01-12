import { registerAs } from '@nestjs/config';
import { IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';
import { Expose, plainToInstance, Transform } from 'class-transformer';

export class DatabaseConfig {
  @Expose({ name: 'DATABASE_HOST' })
  @IsNotEmpty()
  @IsString()
  host: string;

  @Expose({ name: 'DATABASE_PORT' })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  port: number;

  @Expose({ name: 'DATABASE_NAME' })
  @IsNotEmpty()
  @IsString()
  database: string;

  @Expose({ name: 'DATABASE_USER_NAME' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose({ name: 'DATABASE_PASSWORD' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export const databaseConfig = registerAs('database', () => {
  const obj = plainToInstance(DatabaseConfig, process.env, { excludeExtraneousValues: true, exposeDefaultValues: true });

  const errors = validateSync(obj, { skipMissingProperties: false });
  if (errors.length) {
    throw new Error(errors.toString());
  }

  return obj;
});
