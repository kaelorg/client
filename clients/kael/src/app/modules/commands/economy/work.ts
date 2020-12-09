import { Texts } from '@kaelbot/constants';
import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

const usageCooldown = 21600000; // 6 Hours

@injectable()
@command({
  name: 'work',
  category: 'economy',
  aliases: ['trabalhar'],
})
class WorkCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute({
    t,
    m,
    document,
    author,
    channel,
  }: CommandExecuteData) {
    const cooldownWork = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_work);

    if (Date.now() - cooldownWork > usageCooldown) {
      const credit = Math.floor(Math.random() * (500 - 1) + 1);
      const koins = `<:koins:710557837776126053> ${credit} ${
        credit > 1 ? 'Koins' : 'Koin'
      }`;

      await this.database.users.update(author.id, {
        'social.cooldown_work': Date.now(),
        '$inc': { 'social.koins': credit },
      });

      channel.send(
        this.embed(author)
          .setThumbnail('Kael.Card')
          .setAuthor(t('commands:work.author'), author.displayAvatarURL())
          .setDescription(Texts.Shuffle('Work', document.language, { koins })),
      );
    } else {
      channel.error(
        author,
        t('commands:work.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownWork))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default WorkCommand;
