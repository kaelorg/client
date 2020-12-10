import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'balance',
  category: 'economy',
  aliases: ['saldo', 'koins'],
})
class BalanceCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute({ t, author, channel }: CommandExecuteData) {
    const {
      social: { bank, koins },
    } = await this.database.users.findOne(author.id);

    channel.send(
      this.embed(author)
        .setThumbnail('Kael.Card')
        .setAuthor(t('commands:balance.author'), author.displayAvatarURL())
        .setDescription(
          t('commands:balance.total', {
            total: Number(bank + koins).toLocaleString(),
          }),
        )
        .addField(
          t('commands:balance.bank'),
          `<:koins:710557837776126053> **${Number(
            bank,
          ).toLocaleString()}** Koins.`,
          true,
        )
        .addField(
          t('commands:balance.wallet'),
          `<:koins:710557837776126053> **${Number(
            koins,
          ).toLocaleString()}** Koins`,
          true,
        ),
    );
  }
}

export default BalanceCommand;
