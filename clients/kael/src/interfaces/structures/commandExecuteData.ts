/* eslint-disable @typescript-eslint/no-empty-interface */

import { GuildDocument, DocumentResponse } from '@kaelbot/database';
import {
  Message,
  User,
  Guild,
  GuildMember,
  PartialTextBasedChannelFields,
} from 'discord.js';
import { TFunction } from 'i18next';
import moment from 'moment';

import { ChannelExtended } from './extendeds/guild';

export interface CommandExecuteData extends CommandExecuteDataStructure {}

export interface CommandExecuteDataStructure {
  t: TFunction;
  m: typeof moment;

  args: string[];
  document: DocumentResponse<GuildDocument>;

  author: User;

  guild: Guild;
  member: GuildMember;

  message: Message;
  channel: PartialTextBasedChannelFields & ChannelExtended;
}
