import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OnEvent } from '@nestjs/event-emitter';
import { APP_UNINSTALLED_EVENT } from '../dutch-pay.constant';
import { EventPayload } from '../../../slack/types/payloads/event-payload';

@Injectable()
export class AuthListener {
  constructor(private readonly authService: AuthService) {}

  @OnEvent(APP_UNINSTALLED_EVENT, { async: true })
  handleAppUninstalledEvent(eventPayload: EventPayload) {
    const { teamId } = eventPayload;

    return this.authService.deleteWorkspaceById(teamId);
  }
}
