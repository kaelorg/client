import { Collection, Client as DiscordJSClient } from 'discord.js';

import { Event } from '../structures/abstract/event';

export interface Client extends DiscordJSClient {
  events: Collection<string, Event>;
  connect(): Promise<string>;
}
