import { Emojis } from '@kaelbot/constants';
import { ClientUser } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import sortAndLimitDevelopers from '@utils/model/sortAndLimitDevelopers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'charisma',
  category: 'social',
  reference: 'ranking',
  aliases: ['char', 'carisma'],
})
class CharismaRankingCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute({ t, author, channel }: CommandExecuteData) {
    const usersInRank = await sortAndLimitDevelopers(
      { 'social.charisma': -1 },
      5,
    );
    const users = await Promise.all(
      usersInRank.map(async user => {
        const requestedUser = await this.client.users.fetch(user._id as string);

        return {
          charisma: user.social.charisma,
          user: requestedUser.toString(),
        };
      }),
    );

    channel.send(
      this.embed(author)
        .setTitle(t('commands:ranking.charisma.title'))
        .setThumbnail((this.client.user as ClientUser).displayAvatarURL())
        .setDescription(
          users.map(
            ({ user, charisma }, index) =>
              `${Emojis.RankingParsed[index]} ${user} - ${t(
                'commons:subjects.with',
              )} **${charisma}** ${t('commons:economy.charismaPlural')}`,
          ),
        ),
    );
  }
}

export default CharismaRankingCommand;
