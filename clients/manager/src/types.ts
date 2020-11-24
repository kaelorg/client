import { KaelDatabase } from '@kaelbot/database';
import APIWebSocket from '@packages/api-websocket';
import { Client as DiscordJSClient } from 'discord.js';

export interface Client extends DiscordJSClient {
  socket: APIWebSocket;
  database: KaelDatabase;
}
