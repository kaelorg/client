import { GuildMember } from 'discord.js';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'vips',
  category: 'vanity',
  reference: 'vanity',
})
class VipsVanityCommand extends CommandStructure {
  public execute({ t, document, author, channel, guild }: CommandExecuteData) {
    const vanityUsers = document.vanity.users;
    const users = vanityUsers
      .filter(({ id }) => guild.members.cache.has(id))
      .map(({ id, role }) => {
        const member = guild.members.cache.get(id) as GuildMember;

        return `${member.toString()} - <@&${role}>`;
      });

    const embed = this.embed(author)
      .setThumbnail('Kael.Vanity')
      .setTitle(t('commands:vanity.vips.title'))
      .setAuthor(t('commands:vanity.author'), guild.iconURL() || undefined);

    if (!users.length) embed.error();

    channel.send(
      embed.setDescription(
        users.length
          ? `${users.slice(0, 10).join('\n')}${
              users.length > 10 ? '\n...' : ''
            }`
          : t('commands:vanity.vips.noneUsers'),
      ),
    );
  }
}

export default VipsVanityCommand;
