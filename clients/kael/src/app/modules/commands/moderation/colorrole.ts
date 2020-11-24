import { Role, GuildMember } from 'discord.js';

import HexArgument from '@app/arguments/HexArgument';
import RoleArgument from '@app/arguments/RoleArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'colorrole',
  category: 'moderation',
  aliases: ['cargocor'],
  arguments: [new RoleArgument(), new HexArgument()],
  tools: {
    guildOnly: true,
    botPermissions: ['MANAGE_ROLES'],
    userPermissions: ['MANAGE_ROLES'],
  },
})
class ColorRoleCommand extends CommandStructure {
  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    role: Role,
    hex: string,
  ) {
    if ((guild.me as GuildMember).roles.highest.position <= role.position) {
      channel.error(author, t('commands:colorrole.missingPermissions'));
      return;
    }

    await role.edit({ color: hex });
    channel.send(
      this.embed(author)
        .setColor(hex)
        .setTitle(t('commands:colorrole.success')),
    );
  }
}

export default ColorRoleCommand;
