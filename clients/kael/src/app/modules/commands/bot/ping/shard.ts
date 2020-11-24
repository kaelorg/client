import { WebSocketShard } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import NumberArgument from '@app/arguments/NumberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'shard',
  category: 'bot',
  reference: 'ping',
  arguments: [new NumberArgument({ min: 1, acceptNotInteger: false })],
})
class ShardPingCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public execute(
    { t, author, channel }: CommandExecuteData,
    shardNumber: number,
  ) {
    const shardId = shardNumber - 1;
    const shard = this.client.ws.shards.get(shardId);

    if (!shard) {
      channel.error(author, t('commands:ping.shard.notExist'));
    } else {
      channel.send(
        t<string>('commands:ping.shard.ping', {
          shard: shardId,
          response: (this.client.ws.shards.get(shardId) as WebSocketShard).ping,
        }),
      );
    }
  }
}

export default ShardPingCommand;
