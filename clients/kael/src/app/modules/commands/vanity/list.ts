import { GuildMember } from 'discord.js';

import MemberArgument from '@app/arguments/MemberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'list',
  category: 'vanity',
  reference: 'vanity',
  aliases: ['lista'],
  arguments: [new MemberArgument({ required: false, acceptBot: false })],
})
class ListVanityCommand extends CommandStructure {
  public execute(
    {
      t,
      document,
      author,
      channel,
      guild,
      member: authorMember,
    }: CommandExecuteData,
    member: GuildMember = authorMember,
  ) {
    const vanityUsers = document.vanity.users;
    const params = { member: member.user.tag };

    if (!vanityUsers.some(({ id }) => id === member.id)) {
      channel.error(author, t('commands:vanity.list.noVip', params));
      return;
    }

    if (!vanityUsers.some(({ added_by }) => added_by === member.id)) {
      channel.error(author, t('commands:vanity.list.noVipsAdded', params));
      return;
    }

    const embed = this.embed(author)
      .setThumbnail('Kael.Vanity')
      .setAuthor(t('commands:vanity.author'), guild.iconURL() || undefined)
      .setTitle(t('commands:vanity.list.title', params));

    const users = vanityUsers
      .filter(({ added_by }) => added_by === member.id)
      .map(({ id }) => guild.members.cache.get(id))
      .filter(Boolean);

    if (!users.length) {
      embed.error();
    }

    channel.send(
      embed.setDescription(
        users.length
          ? `${users.slice(0, 10).join('\n')}${
              users.length > 10 ? '\n...' : ''
            }`
          : t('commands:vanity.list.noneUsers'),
      ),
    );
  }
}

export default ListVanityCommand;
