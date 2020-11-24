import { User } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import NumberArgument from '@app/arguments/NumberArgument';
import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'transfer',
  category: 'economy',
  aliases: ['transferir'],
  arguments: [
    new UserArgument({ acceptBot: false, acceptSelf: false }),
    new NumberArgument({ min: 10, max: 100000 }),
  ],
})
class TransferCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    user: User,
    value: number,
  ) {
    const bank = await this.client.database.users
      .findOne(author.id)
      .then(({ social }) => social.bank);

    const percent = (value < 500 && 5) || (value < 1000 && 10) || 15;
    const rate = (value / 100) * percent;
    const pay = value + rate;

    if (bank >= pay) {
      await Promise.all([
        guild &&
          this.client.database.guilds.update(guild.id, {
            $inc: { 'social.bank': rate },
          }),
        this.client.database.users.update(user.id, {
          $inc: { 'social.bank': value },
        }),
        this.client.database.users.update(author.id, {
          $inc: { 'social.bank': -pay },
        }),
      ]);

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(t('commands:transfer.author'), author.displayAvatarURL())
          .setDescription(
            t('commands:transfer.description', {
              percent,
              pay: rate.toLocaleString(),
              value: value.toLocaleString(),
            }),
          )
          .addField(
            t('commands:transfer.approved'),
            t('commands:transfer.approvedDescription', {
              user,
              koins: value.toLocaleString(),
            }),
          )
          .addField(
            t('commands:transfer.total'),
            `<:koins:710557837776126053> ${pay.toLocaleString()} Koins.`,
          ),
      );
    } else if (bank >= value) {
      channel.error(author, t('commands:transfer.noTransferRate'));
    } else {
      channel.error(author, t('commands:transfer.noTransfer'));
    }
  }
}

export default TransferCommand;
