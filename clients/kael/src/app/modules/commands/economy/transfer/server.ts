import { KaelDatabase } from '@kaelbot/database';
import { Guild } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import GuildArgument from '@app/arguments/GuildArgument';
import NumberArgument from '@app/arguments/NumberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'server',
  category: 'economy',
  reference: 'transfer',
  aliases: ['servidor'],
  arguments: [
    new GuildArgument(),
    new NumberArgument({ min: 100, max: 100000 }),
  ],
})
class ServerTransferCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { t, author, channel }: CommandExecuteData,
    server: Guild,
    value: number,
  ) {
    const bank = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.bank);

    if (bank >= value) {
      await Promise.all([
        this.database.guilds.update(server.id, {
          $inc: { 'social.bank': value },
        }),
        this.database.users.update(author.id, {
          $inc: { 'social.bank': -value },
        }),
      ]);

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(
            t('commands:transfer.author'),
            server.iconURL() || undefined,
          )
          .setDescription(
            t('commands:transfer.server.success', {
              bank: server.name,
              koins: Number(value).toLocaleString(),
            }),
          ),
      );
    } else {
      channel.error(author, t('commands:transfer.noTransfer'));
    }
  }
}

export default ServerTransferCommand;
