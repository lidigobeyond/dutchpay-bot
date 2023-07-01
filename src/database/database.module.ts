import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomConfigModule } from '../config/custom-config.module';
import { CustomConfigService } from '../config/custom-config.service';
import { Env } from '../config/config.model';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [CustomConfigModule],
      inject: [CustomConfigService],
      useFactory: (customConfigService: CustomConfigService) => {
        const { env } = customConfigService.appConfig;
        const isProd = env === Env.prod;

        const { host, port, username, password, database } = customConfigService.databaseConfig;

        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          entities: [path.join(__dirname, './entities/*.entity{.ts,.js}')],
          namingStrategy: new SnakeNamingStrategy(),
          autoLoadEntities: true,
          synchronize: !isProd,
          logging: isProd ? ['error', 'warn'] : 'all',
        };
      },
    }),
  ],
})
export class DatabaseModule {}
