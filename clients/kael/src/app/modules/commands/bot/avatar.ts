import { User } from 'discord.js';

import UserArgument from '@app/arguments/UserArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'avatar',
  category: 'bot',
  aliases: ['pic'],
  arguments: [new UserArgument({ required: false })],
})
class AvatarCommand extends CommandStructure {
  public execute(
    { t, author, channel }: CommandExecuteData,
    user: User = author,
  ) {
    channel.send(
      this.embed(author)
        .setTitle(t('commands:avatar.title', { user: user.username }))
        .setImage(
          user.displayAvatarURL({ format: 'webp', size: 2048, dynamic: true }),
        ),
    );
  }
}

export default AvatarCommand;
