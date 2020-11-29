import { GuildMember } from 'discord.js';

import MemberArgument from '@app/arguments/MemberArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'serverbooster',
  category: 'bot',
  arguments: [new MemberArgument({ required: false })],
  tools: {
    guildOnly: true,
  },
})
class ServerBoosterCommand extends CommandStructure {
  public execute(
    { t, m, author, channel, member: authorMember }: CommandExecuteData,
    member: GuildMember = authorMember as GuildMember,
  ) {
    if (!member.premiumSince) {
      channel.error(
        author,
        t('commands:serverbooster.noBooster', { member: member.toString() }),
      );
    } else {
      channel.send(
        this.embed(author)
          .setAuthor(member.user.username, member.user.displayAvatarURL())
          .setDescription(
            t('commands:serverbooster.time', {
              time: m(member.premiumSinceTimestamp).format('LLLL'),
            }),
          ),
      );
    }
  }
}

export default ServerBoosterCommand;
