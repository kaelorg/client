import { Emojis } from '@kaelbot/constants';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import sortAndLimitDevelopers from '@utils/model/sortAndLimitDevelopers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'reputation',
  category: 'social',
  reference: 'ranking',
  aliases: ['rep', 'reputação'],
})
class ReputationRankingCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute({ t, author, channel }: CommandExecuteData) {
    const usersInRank = await sortAndLimitDevelopers(
      { 'social.reputation': -1 },
      5,
    );
    const users = await Promise.all(
      usersInRank.map(async user => {
        const requestedUser = await this.client.users.fetch(user._id as string);

        return {
          reputation: user.social.reputation,
          user: requestedUser.toString(),
        };
      }),
    );

    channel.send(
      this.embed(author)
        .setTitle(t('commands:ranking.reputation.title'))
        .setThumbnail(this.client.user.displayAvatarURL())
        .setDescription(
          users.map(
            ({ user, reputation }, index) =>
              `${Emojis.RankingParsed[index]} ${user} - ${t(
                'commons:subjects.with',
              )} **${reputation}** ${t('commons:economy.reputationPlural')}`,
          ),
        ),
    );
  }
}

export default ReputationRankingCommand;
