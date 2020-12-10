import { KaelDatabase } from '@kaelbot/database';
import { User } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

const UsageValue = 1000;
const UsageCooldown = 18000000; // 5 Hours

@injectable()
@command({
  name: 'allpoints',
  category: 'social',
  aliases: ['superpontos'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class AllPointsCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { t, m, author, channel }: CommandExecuteData,
    user: User,
  ) {
    const {
      koins,
      cooldown_all_points: cooldownAllPoints,
    } = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social);

    if (Date.now() - cooldownAllPoints > UsageCooldown) {
      if (koins < UsageValue) {
        channel.error(author, t('commands:allpoints.notHaveKoins'));
        return;
      }

      await Promise.all([
        this.database.users.update(author.id, {
          'social.cooldown_all_points': Date.now(),
          '$inc': { 'social.koins': -UsageValue },
        }),
        this.database.users.update(user.id, {
          $inc: {
            'social.charisma': 1,
            'social.reputation': 1,
            'social.perfection': 1,
            'social.intelligence': 1,
          },
        }),
      ]);

      channel.send(
        this.embed(author)
          .setThumbnail(user.displayAvatarURL())
          .setAuthor(
            t('commands:allpoints.author'),
            author.avatarURL() || undefined,
          )
          .setDescription(
            t('commands:allpoints.title', {
              user: user.tag,
              author: author.toString(),
            }),
          )
          .addField(
            t('commands:allpoints.pointsTitle'),
            t('commands:allpoints.points'),
          ),
      );
    } else {
      channel.error(
        author,
        t('commands:allpoints.cooldown', {
          time: m
            .duration(UsageCooldown - (Date.now() - cooldownAllPoints))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default AllPointsCommand;
