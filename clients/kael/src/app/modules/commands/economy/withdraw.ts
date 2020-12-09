import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import NumberArgument from '@app/arguments/NumberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'withdraw',
  category: 'economy',
  aliases: ['sacar'],
  arguments: [new NumberArgument({ min: 10, max: 500000 })],
})
class WithdrawCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    value: number,
  ) {
    const bank = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.bank);

    const percent = (value < 500 && 5) || (value < 1000 && 10) || 25;
    const rate = (value / 100) * percent;
    const pay = value + rate;

    if (bank >= pay) {
      await Promise.all([
        guild &&
          this.database.guilds.update(guild.id, {
            $inc: { 'social.bank': rate },
          }),
        this.database.users.update(author.id, {
          $inc: { 'social.bank': -pay, 'social.koins': value },
        }),
      ]);

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(t('commands:withdraw.author'), author.displayAvatarURL())
          .setDescription(
            t('commands:withdraw.description', {
              percent,
              pay: rate.toLocaleString(),
              koins: value.toLocaleString(),
            }),
          )
          .addField(
            t('commands:withdraw.approved'),
            t('commands:withdraw.approvedDescription', {
              koins: value.toLocaleString(),
            }),
          )
          .addField(
            t('commands:withdraw.total'),
            `<:koins:710557837776126053> ${pay.toLocaleString()} Koins.`,
          ),
      );
    } else if (bank >= value) {
      channel.error(author, t('commands:withdraw.noBalanceRate'));
    } else {
      channel.error(author, t('commands:withdraw.noBalance'));
    }
  }
}

export default WithdrawCommand;
