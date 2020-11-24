import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'shard',
  category: 'bot',
  tools: {
    guildOnly: true,
  },
})
class ShardCommand extends CommandStructure {
  public execute({ t, channel, guild }: CommandExecuteData) {
    channel.send(
      t<string>('commands:shard', {
        guild: guild.name,
        shard: guild.shardID,
      }),
    );
  }
}

export default ShardCommand;
