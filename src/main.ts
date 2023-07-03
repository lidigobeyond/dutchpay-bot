import 'reflect-metadata';
import './common/dayjs/dayjs';
import { NestFactory } from '@nestjs/core';
import { CustomConfigService } from './config/custom-config.service';
import { AppModule } from './modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const customConfigService = app.get(CustomConfigService);

  const { port } = customConfigService.appConfig;

  await app.listen(port);
}

setImmediate(async () => {
  await bootstrap();
});
