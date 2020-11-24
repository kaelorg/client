import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'list',
  category: 'system',
  reference: 'autorole',
  aliases: ['lista'],
})
class ListAutoRoleCommand extends CommandStructure {
  public execute({ t, document, author, channel, guild }: CommandExecuteData) {
    const { roles } = document.auto_role;
    const embed = this.embed(author)
      .setThumbnail('Kael.Count')
      .setAuthor(
        t('commands:autorole.list.author'),
        guild.iconURL() || undefined,
      );

    if (roles.length) {
      embed
        .setDescription(roles.map(role => `<@&${role}>`).join(', '))
        .setTitle(t('commands:autorole.list.title', { size: roles.length }));
    } else {
      embed.error().setTitle(t('commands:autorole.list.noRoles'));
    }

    channel.send(embed);
  }
}

export default ListAutoRoleCommand;
