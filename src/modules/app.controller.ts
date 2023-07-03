import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/_ah/warmup')
  @HttpCode(200)
  handleWarmup() {
    return;
  }
}
