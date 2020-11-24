import { User } from 'discord.js';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'unban',
  category: 'moderation',
  aliases: ['desbanir'],
  arguments: [new UserArgument({ acceptSelf: false })],
  tools: {
    guildOnly: true,
    botPermissions: ['BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
  },
})
class UnBanCommand extends CommandStructure {
  constructor() {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    user: User,
  ) {
    const ban = await guild.fetchBan(user.id).catch(() => null);

    if (!ban) {
      channel.error(author, t('commands:unban.isNotBanned'));
      return;
    }

    await guild.members.unban(user.id);
    channel.send(
      this.embed(author)
        .setThumbnail(user.displayAvatarURL())
        .setAuthor(t('commands:unban.author'), guild.iconURL() || undefined)
        .setDescription(
          t('commands:unban.description', {
            user: user.tag,
            author: author.toString(),
          }),
        )
        .addField('ID', user.id),
    );
  }
}

export default UnBanCommand;
