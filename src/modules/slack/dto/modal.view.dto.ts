import { Block, KnownBlock, ModalView as Parent } from '@slack/web-api';
import { PlainTextElement } from './plain-text-element.dto';

export class ModalView implements Parent {
  type: 'modal' = 'modal';

  constructor(
    public title: PlainTextElement,
    public blocks: (KnownBlock | Block)[],
  ) {}
}
