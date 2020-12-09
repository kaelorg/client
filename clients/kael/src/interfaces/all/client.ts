import { KaelDatabase } from '@kaelbot/database';
import { Collection, ClientUser, Client as DiscordJSClient } from 'discord.js';

import { Event } from '../structures/abstract/event';

export interface Client extends DiscordJSClient {
  user: ClientUser;
  database: KaelDatabase;
  events: Collection<string, Event>;
  connect(): Promise<string>;
}
