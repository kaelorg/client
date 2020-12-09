import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

const usageCooldown = 43200000; // 12 Hours

@injectable()
@command({
  name: 'daily',
  category: 'economy',
  aliases: ['bonusdiario', 'auxilio'],
})
class DailyCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute({ t, m, author, channel }: CommandExecuteData) {
    const cooldownDaily = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_daily);

    if (Date.now() - cooldownDaily > usageCooldown) {
      const credit = Math.floor(Math.random() * (400 - 5) + 5);

      await this.database.users.update(author.id, {
        'social.cooldown_daily': Date.now(),
        '$inc': { 'social.koins': credit },
      });

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(t('commands:daily.author'), author.displayAvatarURL())
          .setDescription(t('commands:daily.success', { koins: credit })),
      );
    } else {
      channel.error(
        author,
        t('commands:daily.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownDaily))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default DailyCommand;
