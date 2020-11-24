import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'autorole',
  category: 'system',
  aliases: ['autocargo'],
  tools: {
    guildOnly: true,
    botPermissions: ['MANAGE_GUILD'],
    userPermissions: ['MANAGE_GUILD'],
  },
})
class AutoRoleCommand extends CommandStructure {
  public execute({ t, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail('Kael.AutoRole')
        .setAuthor(
          t('commands:autorole.help.author'),
          guild.iconURL() || undefined,
        )
        .addField(
          t('commands:autorole.help.addTitle'),
          t('commands:autorole:help.add'),
        )
        .addField(
          t('commands:autorole.help.removeTitle'),
          t('commands:autorole.help.remove'),
        )
        .addField(
          t('commands:autorole.help.listTitle'),
          t('commands:autorole.help.list'),
        )
        .addField(
          t('commands:autorole.help.resetTitle'),
          t('commands:autorole.help.reset'),
        ),
    );
  }
}

export default AutoRoleCommand;
