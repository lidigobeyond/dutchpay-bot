import { Block, KnownBlock } from '@slack/types';

export interface IMessage {
  toBlocks(): (KnownBlock | Block)[];
}
