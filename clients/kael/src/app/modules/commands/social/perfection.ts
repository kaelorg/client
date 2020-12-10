import { KaelDatabase } from '@kaelbot/database';
import { User } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

const usageCooldown = 7200000; // 2 Hours

@injectable()
@command({
  name: 'perfection',
  category: 'social',
  aliases: ['perf', 'perfeição'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class PerfectionCommand extends CommandStructure {
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
    const cooldownPerfection = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_perfection);

    if (Date.now() - cooldownPerfection > usageCooldown) {
      await Promise.all([
        this.database.users.update(author.id, {
          'social.cooldown_perfection': Date.now(),
        }),
        this.database.users.update(user.id, {
          $inc: { 'social.perfection': 1 },
        }),
      ]);

      channel.send(
        t<string>('commands:perfection.success', {
          user: user.tag,
          author: author.toString(),
        }),
      );
    } else {
      channel.error(
        author,
        t('commands:perfection.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownPerfection))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default PerfectionCommand;
