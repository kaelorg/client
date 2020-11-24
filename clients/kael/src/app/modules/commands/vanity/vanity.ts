import { Urls } from '@kaelbot/constants';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'vanity',
  category: 'vanity',
  tools: {
    guildOnly: true,
  },
})
class VanityCommand extends CommandStructure {
  public execute({ t, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail('Kael.Vanity')
        .setAuthor(t('commands:vanity.author'), guild.iconURL() || undefined)
        .setDescription(
          t('commands:vanity.description', {
            link: `${Urls.Dashboard}/guilds/${guild.id}/vanity`,
          }),
        ),
    );
  }
}

export default VanityCommand;
