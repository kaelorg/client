import logger from '@packages/logger';
import { captureException } from '@sentry/node';
import { ClientUser } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import listener from '@app/decorators/event/listener';
import EventStructure from '@core/structures/abstract/EventStructure';

import { Namespace } from '@config/containers';

import makePresence from '@utils/client/makePresence';
import debug from '@utils/debug';

import { Client } from '@interfaces';

@injectable()
class WebSocketEvent extends EventStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  @listener('error')
  protected onError(message: any): void {
    captureException(message);
    debug('event:error', message);
  }

  @listener('debug')
  protected onDebug(message: any): void {
    debug('event:debug', message);
  }

  @listener('ready', { once: true })
  protected onReady(): void {
    logger.info('The client successfully connected to the websocket!', {
      label: 'ready',
    });
  }

  @listener('shardReady')
  protected async onShardReady(shardId: number): Promise<void> {
    const { ws, user } = this.client;
    const clientUser = user as ClientUser;

    await clientUser.setPresence(
      Object.assign(makePresence(Math.max(shardId, 1), ws.shards.size), {
        shardID: shardId,
      }),
    );
  }
}

export default WebSocketEvent;
