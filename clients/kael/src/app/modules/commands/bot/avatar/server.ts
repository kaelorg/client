import { Guild, ClientUser } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'server',
  category: 'bot',
  reference: 'avatar',
  aliases: ['servidor'],
  tools: {
    guildOnly: true,
  },
})
class ServerAvatarCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public execute(
    { t, author, channel, guild }: CommandExecuteData,
    server: Guild = guild,
  ) {
    channel.send(
      this.embed(author)
        .setTitle(t('commands:avatar.titleServer', { guild: server.name }))
        .setImage(
          server.iconURL({ format: 'webp', size: 2048, dynamic: true }) ||
            (this.client.user as ClientUser).displayAvatarURL({
              format: 'webp',
              size: 2048,
              dynamic: true,
            }),
        ),
    );
  }
}

export default ServerAvatarCommand;
