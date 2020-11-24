import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'roleall',
  category: 'system',
  aliases: ['cargotodos'],
  tools: {
    guildOnly: true,
    botPermissions: ['MANAGE_GUILD'],
    userPermissions: ['MANAGE_GUILD'],
  },
})
class RoleAllCommand extends CommandStructure {
  public execute({ t, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail(guild.iconURL() as string)
        .setAuthor(
          t('commands:roleall.help.author'),
          guild.iconURL() || undefined,
        )
        .addField(
          t('commands:roleall.help.addTitle'),
          t('commands:roleall.help.add'),
        )
        .addField(
          t('commands:roleall.help.removeTitle'),
          t('commands:roleall.help.remove'),
        ),
    );
  }
}

export default RoleAllCommand;
