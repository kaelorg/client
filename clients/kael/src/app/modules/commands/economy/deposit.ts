import moment from 'moment';
import { inject, injectable } from 'tsyringe';

import NumberArgument from '@app/arguments/NumberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'deposit',
  category: 'economy',
  aliases: ['deposito', 'depositar', 'dep'],
  arguments: [new NumberArgument({ required: false, min: 1 })],
})
class DepositCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, author, channel }: CommandExecuteData,
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
      const koins = await this.client.database.users
        .findOne(author.id)
        .then(({ social }) => social.koins);

      if (koins >= value) {
        await this.client.database.users.update(author.id, {
          $inc: { 'social.koins': -value, 'social.bank': value },
          $push: {
            'social.extract': `${t('commands:deposit.extract', {
              time: moment().format('LLL'),
              koins: Number(value).toLocaleString(),
            })}`,
          },
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
