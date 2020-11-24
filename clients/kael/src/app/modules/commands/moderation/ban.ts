import { GuildMember } from 'discord.js';

import MemberArgument from '@app/arguments/MemberArgument';
import StringArgument from '@app/arguments/StringArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'ban',
  category: 'moderation',
  aliases: ['banir'],
  arguments: [
    new MemberArgument({ acceptSelf: false }),
    new StringArgument({ required: false }),
  ],
  tools: {
    guildOnly: true,
    botPermissions: ['BAN_MEMBERS'],
    userPermissions: ['BAN_MEMBERS'],
  },
})
class BanCommand extends CommandStructure {
  public async execute(
    { t, author, channel, guild, member: authorMember }: CommandExecuteData,
    member: GuildMember = authorMember,
    reason: string = t('commands:ban.noReason'),
  ) {
    if (
      guild.ownerID !== author.id &&
      member.roles.highest.position >= authorMember.roles.highest.position
    ) {
      channel.error(author, t('commands:ban.missingUserPermissions'));
      return;
    }

    if (!member.bannable) {
      channel.error(author, t('commands:ban.missingClientPermissions'));
      return;
    }

    await member.ban({ reason, days: 7 });
    channel.send(
      this.embed(author)
        .setThumbnail(member.user.displayAvatarURL())
        .setAuthor(t('commands:ban.author'), guild.iconURL() || undefined)
        .setDescription(
          t('commands:ban.description', {
            member: member.user.tag,
            author: author.toString(),
          }),
        )
        .addField('ID', member.id)
        .addField(t('commands:ban.reason'), reason),
    );
  }
}

export default BanCommand;
