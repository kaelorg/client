import { User } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

const usageCooldown = 7200000; // 2 Hours

@injectable()
@command({
  name: 'charisma',
  category: 'social',
  aliases: ['char', 'carisma'],
  arguments: [new UserArgument({ acceptBot: false, acceptSelf: false })],
})
class CharismaCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, m, author, channel }: CommandExecuteData,
    user: User,
  ) {
    const cooldownCharisma = await this.client.database.users
      .findOne(author.id)
      .then(({ social }) => social.cooldown_charisma);

    if (Date.now() - cooldownCharisma > usageCooldown) {
      await Promise.all([
        this.client.database.users.update(author.id, {
          'social.cooldown_charisma': Date.now(),
        }),
        this.client.database.users.update(user.id, {
          $inc: { 'social.charisma': 1 },
        }),
      ]);

      channel.send(
        t<string>('commands:charisma.success', {
          user: user.tag,
          author: author.toString(),
        }),
      );
    } else {
      channel.error(
        author,
        t('commands:charisma.cooldown', {
          time: m
            .duration(usageCooldown - (Date.now() - cooldownCharisma))
            .format('h[h] m[m] s[s]'),
        }),
      );
    }
  }
}

export default CharismaCommand;
