import { KaelDatabase } from '@kaelbot/database';
import APIWebSocket from '@packages/api-websocket';
import logger from '@packages/logger';
import { Client as DiscordJSClient } from 'discord.js';

import { Client as IClient } from './types';

import clientConfig from './config/client';
import managers from './managers';

class Client extends DiscordJSClient implements IClient {
  public readonly socket = new APIWebSocket();

  public readonly database = new KaelDatabase();

  constructor() {
    super(clientConfig);

    this.once('ready', async () => {
      logger.info('The client was connected to the Discord websocket.', {
        label: 'ready',
      });

      await this.loadManagers();
    });

    this.on('shardReady', shardId => {
      logger.info(`The shard "${shardId}" was successfully connected.`, {
        label: 'shard-ready',
      });
    });

    this.on('shardReconnecting', shardId => {
      logger.info(`The shard "${shardId}" is reconnecting.`, {
        label: 'shard-reconnecting',
      });
    });

    this.on('shardDisconnect', (_event, shardId) => {
      logger.warn(`The shard "${shardId}" was disconnected.`, {
        label: 'shard-disconnect',
      });
    });
  }

  public async connect() {
    await this.database.connect(process.env.MONGOOSE_CONNECTION_STRING);

    await super.login(process.env.DISCORD_TOKEN);
    this.socket.connect();
  }

  //

  private loadManagers(): Promise<void[]> {
    return Promise.all(
      Object.values(managers).map(Manager => new Manager(this).load()),
    );
  }
}

export default Client;
