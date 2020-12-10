import { Collection, Client as DiscordJSClient } from 'discord.js';

import clientConfig from '@config/client';

import { Event, Client as IClient } from '@interfaces';

class Client extends DiscordJSClient implements IClient {
  public readonly events: Collection<string, Event> = new Collection();

  constructor() {
    super(clientConfig);
  }

  public connect(): Promise<string> {
    return super.login(process.env.DISCORD_TOKEN);
  }
}

export default Client;
