import { KaelDatabase } from '@kaelbot/database';
import { User } from 'discord.js';
import { container, inject, injectable } from 'tsyringe';

import UserArgument from '@app/arguments/UserArgument';
import profileTemplate from '@app/canvas/templates/profile';
import command from '@app/decorators/command/command';
import UserMakeBadgesService from '@app/services/user/UserMakeBadgesService';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'profile',
  category: 'social',
  aliases: ['perfil'],
  arguments: [new UserArgument({ required: false, acceptBot: false })],
  tools: {
    botPermissions: ['ATTACH_FILES'],
  },
})
class ProfileCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { document, author, channel }: CommandExecuteData,
    user: User = author,
  ) {
    const userMakeBadges = container.resolve(UserMakeBadgesService);

    const { social } = await this.database.users.findOne(user.id);
    const badges = await userMakeBadges.execute(user);

    const profile = await profileTemplate(
      { user, language: document.language },
      Object.assign(social, { badges }),
    );

    channel.send({
      files: [{ attachment: profile, name: `kael_profile_${user.id}.png` }],
    });
  }
}

export default ProfileCommand;
