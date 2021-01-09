/* eslint-disable @typescript-eslint/no-empty-interface */

import { User, Message, DMChannel, NewsChannel, TextChannel } from 'discord.js';

export type ChannelExtended = ChannelExtendedStructure;

export type ChannelExtendedStructure = (
  | TextChannel
  | DMChannel
  | NewsChannel
) & {
  canSendMessages: boolean;
  error(
    user: User,
    content: string | ChannelExtendedErrorContentOptions,
  ): Promise<Message> | undefined;
};

export interface ChannelExtendedErrorContentOptions {
  title: string;
  description: string;
}
