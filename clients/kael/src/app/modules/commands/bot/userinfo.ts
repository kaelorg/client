import { User } from 'discord.js';
import moment from 'moment';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'userinfo',
  category: 'bot',
  arguments: [new UserArgument({ required: false })],
})
class UserInfoCommand extends CommandStructure {
  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    user: User = author,
  ) {
    const embed = this.embed(author)
      .setThumbnail(user.displayAvatarURL())
      .setTitle(t('commands:userinfo.title', { user: user.tag }))
      .addField('ID', `\`\`\`${user.id}\`\`\``, false)
      .addField(
        t('commands:userinfo.createdAt'),
        moment(user.createdAt).format('LLLL'),
      );

    const member =
      guild && (await guild.members.fetch(user.id).catch(() => null));

    if (member) {
      embed
        .addField(
          t('commands:userinfo.nick'),
          member.nickname ? member.nickname : t('commands:userinfo.constNick'),
          true,
        )
        .addField(
          t('commands:userinfo.joinedAt'),
          moment(member.joinedAt).format('LLLL'),
        );
    }

    channel.send(embed);
  }
}

export default UserInfoCommand;
