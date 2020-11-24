import { KaelDatabase } from '@kaelbot/database';
import APIWebSocket, { Socket } from '@packages/api-websocket';
import { EventEmitter } from 'events';

import { Client } from '../types';

abstract class BaseManager extends EventEmitter {
  protected readonly subscription?: Socket;

  protected readonly client: Client;

  protected abstract init(): any;

  constructor(client: Client) {
    super();

    this.client = client;
  }

  get socket(): APIWebSocket {
    return this.client.socket;
  }

  get database(): KaelDatabase {
    return this.client.database;
  }

  public async load(): Promise<void> {
    await this.init();

    if (!this.subscription) return;
    if (this.subscription.listenerCount('error') <= 0) {
      this.subscription.on('error', () => {});
    }
  }
}

export default BaseManager;
