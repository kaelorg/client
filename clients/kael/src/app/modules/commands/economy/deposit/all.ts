import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'all',
  category: 'economy',
  reference: 'deposit',
  aliases: ['tudo'],
})
class AllDepositCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute({ t, author, channel }: CommandExecuteData) {
    const koins = await this.client.database.users
      .findOne(author.id)
      .then(({ social }) => social.koins);

    if (koins >= 1) {
      await this.client.database.users.update(author.id, {
        $inc: { 'social.koins': -koins, 'social.bank': koins },
      });

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(t('commands:deposit.author'), author.displayAvatarURL())
          .setDescription(
            t('commands:deposit.all.success', {
              koins: Number(koins).toLocaleString(),
            }),
          ),
      );
    } else {
      channel.error(author, t('commands:deposit.all.invalidBalance'));
    }
  }
}

export default AllDepositCommand;
