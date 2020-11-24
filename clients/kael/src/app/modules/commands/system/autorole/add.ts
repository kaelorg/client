import { Role } from 'discord.js';
import { inject, injectable } from 'tsyringe';

import RoleArgument from '@app/arguments/RoleArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'add',
  category: 'system',
  reference: 'autorole',
  aliases: ['adicionar'],
  arguments: [new RoleArgument()],
})
class AddAutoRoleCommand extends CommandStructure {
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

    if (roles.length >= 20) {
      channel.error(author, t('commands:autorole.add.limit'));
      return;
    }

    if (roles.some(r => r === role.id)) {
      channel.error(
        author,
        t('commands:autorole.add.hasRole', { role: role.id }),
      );
      return;
    }

    await this.client.database.guilds.update(guild.id, {
      'auto_role.active': true,
      '$push': { 'auto_role.roles': role.id },
    });

    channel.send(
      this.embed(author).setDescription(
        t('commands:autorole.add.success', { role: role.id }),
      ),
    );
  }
}

export default AddAutoRoleCommand;
