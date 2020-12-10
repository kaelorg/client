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
  name: 'intelligence',
  category: 'social',
  aliases: ['int', 'inteligencia', 'inteligência'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class IntelligenceCommand extends CommandStructure {
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
    const cooldownIntelligence = await this.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_intelligence);

    if (Date.now() - cooldownIntelligence > usageCooldown) {
      await Promise.all([
        this.database.users.update(author.id, {
          'social.cooldown_intelligence': Date.now(),
        }),
        this.database.users.update(user.id, {
          $inc: { 'social.intelligence': 1 },
        }),
      ]);

      channel.send(
        t<string>('commands:intelligence.success', {
          user: user.tag,
          author: author.toString(),
        }),
      );
    } else {
      channel.error(
        author,
        t('commands:intelligence.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownIntelligence))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default IntelligenceCommand;
