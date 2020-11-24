import { Role } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import RoleArgument from '@app/arguments/RoleArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'remove',
  category: 'system',
  reference: 'autorole',
  aliases: ['remover'],
  arguments: [new RoleArgument()],
})
class RemoveAutoRoleCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, document, author, channel, guild }: CommandExecuteData,
    role: Role,
  ) {
    const { roles } = document.auto_role;

    if (!roles.some(roleId => roleId === role.id)) {
      channel.error(
        author,
        t('commands:autorole.remove.notRole', { role: role.id }),
      );
      return;
    }

    await this.client.database.guilds.update(guild.id, {
      $pull: { 'auto_role.roles': role.id },
    });

    channel.send(
      this.embed(author).setDescription(
        t('commands:autorole.remove.success', { role: role.id }),
      ),
    );
  }
}

export default RemoveAutoRoleCommand;
