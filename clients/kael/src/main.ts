import { KaelDatabase } from '@kaelbot/database';
import APIWebSocket from '@packages/api-websocket';
import { eachSeries } from 'async';
import { container } from 'tsyringe';

import { Namespace } from './config/containers';
import { Client } from './interfaces';

/**
 * Starts the client.
 */
async function main() {
  const client = container.resolve<Client>(Namespace.Client);
  const database = container.resolve<KaelDatabase>(Namespace.Database);
  const apiWebSocket = container.resolve<APIWebSocket>(Namespace.APIWebSocket);

  await eachSeries(
    [
      () => database.connect(process.env.MONGOOSE_CONNECTION_STRING),
      () => client.connect(),
      () => apiWebSocket.connect(false),
    ],
    async run => run(),
  );
}

export default main;
