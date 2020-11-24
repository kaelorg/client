import { KaelDatabase } from '@kaelbot/database';
import { Collection, Client as DiscordJSClient } from 'discord.js';

import clientConfig from '@config/client';

import { Event, Client as IClient } from '@interfaces';

class Client extends DiscordJSClient implements IClient {
  public readonly database = new KaelDatabase();

  public readonly events: Collection<string, Event> = new Collection();

  constructor() {
    super(clientConfig);
  }

  public async connect(): Promise<string> {
    await this.database.connect(process.env.MONGOOSE_CONNECTION_STRING);

    return super.login(process.env.DISCORD_TOKEN);
  }
}

export default Client;
