import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'ranking',
  category: 'social',
  aliases: ['rank'],
})
class RankingCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public execute({ t, author, channel }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail(this.client.user.displayAvatarURL())
        .setAuthor(t('commands:ranking.author'), author.displayAvatarURL())
        .addField(
          t('commands:ranking.reputation.usageTitle'),
          t('commands:ranking.reputation.usageDescription'),
        )
        .addField(
          t('commands:ranking.perfection.usageTitle'),
          t('commands:ranking.perfection.usageDescription'),
        )
        .addField(
          t('commands:ranking.charisma.usageTitle'),
          t('commands:ranking.charisma.usageDescription'),
        )
        .addField(
          t('commands:ranking.intelligence.usageTitle'),
          t('commands:ranking.intelligence.usageDescription'),
        ),
    );
  }
}

export default RankingCommand;
