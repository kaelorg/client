import { KaelDatabase } from '@kaelbot/database';
import { User } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

const usageCooldown = 43200000; // 12 Hours

@injectable()
@command({
  name: 'reputation',
  category: 'social',
  aliases: ['rep', 'reputação'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class ReputationCommand extends CommandStructure {
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
    const cooldownReputation = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_reputation);

    if (Date.now() - cooldownReputation > usageCooldown) {
      await Promise.all([
        this.database.users.update(author.id, {
          'social.cooldown_reputation': Date.now(),
        }),
        this.database.users.update(user.id, {
          $inc: { 'social.reputation': 1 },
        }),
      ]);

      channel.send(
        t<string>('commands:reputation.success', {
          user: user.tag,
          author: author.toString(),
        }),
      );
    } else {
      channel.error(
        author,
        t('commands:reputation.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownReputation))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default ReputationCommand;
