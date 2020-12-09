import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import NumberArgument from '@app/arguments/NumberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'deposit',
  category: 'economy',
  aliases: ['deposito', 'depositar', 'dep'],
  arguments: [new NumberArgument({ required: false, min: 1 })],
})
class DepositCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { t, m, author, channel }: CommandExecuteData,
    value?: number,
  ) {
    if (!value) {
      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(
            t('commands:deposit.help.author'),
            author.displayAvatarURL(),
          )
          .addField(
            t('commands:deposit.help.bankAll'),
            t('commands:deposit:help.bank'),
          )
          .addField(
            t('commands:deposit.help.bankDp'),
            t('commands:deposit.help.bankdps'),
          ),
      );
    } else {
      const koins = await this.database.users
        .findOne(author.id)
        .then(({ social }) => social.koins);

      if (koins >= value) {
        await this.database.users.update(author.id, {
          $inc: { 'social.koins': -value, 'social.bank': value },
        });

        channel.send(
          this.embed(author)
            .setThumbnail('Kael.Card')
            .setAuthor(t('commands:deposit.author'), author.displayAvatarURL())
            .setDescription(
              t('commands:deposit.success', {
                koins: Number(value).toLocaleString(),
              }),
            ),
        );
      } else {
        channel.error(author, t('commands:deposit.invalidBalance'));
      }
    }
  }
}

export default DepositCommand;
