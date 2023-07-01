import { Controller, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('dutch-pay-app')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('install')
  async install(@Query('code') tempToken: string): Promise<void> {
    return this.authService.getAndSaveToken(tempToken);
  }
}
