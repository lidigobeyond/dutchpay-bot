import 'reflect-metadata';
import './common/dayjs/dayjs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}

setImmediate(async () => {
  await bootstrap();
});
