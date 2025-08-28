import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { APP_UNINSTALLED_EVENT } from '../dutch-pay.constant';
import { EventPayload } from '../../../slack/types/payloads/event-payload';
import { CustomOnEvent } from '../../../event-emitter/event-emitter.decorator';

@Injectable()
export class AuthListener {
  constructor(private readonly authService: AuthService) {}

  @CustomOnEvent(APP_UNINSTALLED_EVENT, { async: true })
  handleAppUninstalledEvent(eventPayload: EventPayload) {
    const { teamId } = eventPayload;

    return this.authService.deleteWorkspaceByTeamId(teamId);
  }
}
