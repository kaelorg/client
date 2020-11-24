import { Channel } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import GuildChannelArgument from '@app/arguments/GuildChannelArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'channel',
  category: 'system',
  reference: 'count',
  aliases: ['canal'],
  arguments: [new GuildChannelArgument()],
})
class ChannelCountCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    countChannel: Channel,
  ) {
    const channelId = countChannel.id;

    await this.client.database.guilds.update(guild.id, {
      'count.active': true,
      'count.channel': channelId,
    });

    channel.send(
      this.embed(author).setDescription(
        t('commands:count.channel.success', { channel: channelId }),
      ),
    );
  }
}

export default ChannelCountCommand;
