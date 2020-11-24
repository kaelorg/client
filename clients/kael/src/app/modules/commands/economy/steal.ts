import { Texts } from '@kaelbot/constants';
import randomSuccess from '@packages/random-success';
import { User } from 'discord.js';
import moment from 'moment';
import { inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

const usageCooldown = 21600000; // 6 Hours

@injectable()
@command({
  name: 'steal',
  category: 'economy',
  aliases: ['rob', 'roubar', 'assaltar'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class StealCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, document, author, channel }: CommandExecuteData,
    user: User,
  ) {
    const [
      { intelligence, cooldown_steal: cooldownSteal },
      userKoins,
    ] = await Promise.all([
      this.client.database.users
        .findOne(author.id)
        .then(({ social }) => social),
      this.client.database.users
        .findOne(user.id)
        .then(({ social }) => social.koins),
    ]);

    if (Date.now() - cooldownSteal > usageCooldown) {
      const embed = this.embed(author)
        .setThumbnail('Kael.Card')
        .setAuthor(t('commands:steal.author'), author.displayAvatarURL());

      const credits = Math.floor(Math.random() * (350 - 1) + 1);
      const koins = `<:koins:710557837776126053> ${credits} ${
        credits > 1 ? 'Koins' : 'Koin'
      }`;

      const success = randomSuccess(intelligence);

      if (success) {
        if (userKoins >= credits) {
          await Promise.all([
            this.client.database.users.update(author.id, {
              $inc: { 'social.koins': credits },
            }),
            this.client.database.users.update(user.id, {
              $inc: { 'social.koins': -credits },
            }),
          ]);

          embed.setDescription(
            Texts.Shuffle('Steal', document.language, {
              koins,
              user: user.tag,
            }),
          );
        } else {
          embed
            .error()
            .setDescription(
              t('commands:steal.noMoney', { koins, user: user.tag }),
            );
        }
      } else {
        embed.error().setDescription(
          Texts.Shuffle('StealFailed', document.language, {
            koins,
            user: user.tag,
          }),
        );
      }

      await this.client.database.users.update(author.id, {
        'social.cooldown_steal': Date.now(),
        ...(!success || !(userKoins >= credits)
          ? { $inc: { 'social.koins': -credits } }
          : {}),
      });

      channel.send(embed);
    } else {
      channel.error(
        author,
        t('commands:steal.cooldown', {
          time: moment
            .duration(usageCooldown - (Date.now() - cooldownSteal))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default StealCommand;
