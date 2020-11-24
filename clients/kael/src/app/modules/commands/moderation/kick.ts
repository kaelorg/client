import { GuildMember } from 'discord.js';

import MemberArgument from '@app/arguments/MemberArgument';
import StringArgument from '@app/arguments/StringArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'kick',
  category: 'moderation',
  aliases: ['chutar', 'expulsar'],
  arguments: [
    new MemberArgument({ acceptSelf: false }),
    new StringArgument({ required: false }),
  ],
  tools: {
    guildOnly: true,
    botPermissions: ['KICK_MEMBERS'],
    userPermissions: ['KICK_MEMBERS'],
  },
})
class KickCommand extends CommandStructure {
  public async execute(
    { t, author, channel, guild, member: authorMember }: CommandExecuteData,
    member: GuildMember = authorMember,
    reason: string = t('commands:kick.noReason'),
  ) {
    if (
      guild.ownerID !== author.id &&
      member.roles.highest.position >= authorMember.roles.highest.position
    ) {
      channel.error(author, t('commands:kick.missingUserPermissions'));
      return;
    }

    if (!member.kickable) {
      channel.error(author, t('commands:kick.missingClientPermissions'));
      return;
    }

    await member.kick(reason);
    channel.send(
      this.embed(author)
        .setAuthor(t('commands:kick.author'))
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(
          t('commands:kick.description', {
            author: author.toString(),
            member: member.user.tag,
          }),
        )
        .addField(t('commands:kick.reason'), `\`\`\`${reason}\`\`\``),
    );
  }
}

export default KickCommand;
