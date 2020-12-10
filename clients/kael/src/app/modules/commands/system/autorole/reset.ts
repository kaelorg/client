import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'reset',
  category: 'system',
  reference: 'autorole',
  aliases: ['resetar'],
})
class ResetAutoRoleCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute({ t, author, channel, guild }: CommandExecuteData) {
    await this.database.guilds.update(guild.id, { auto_role: {} });

    channel.send(
      this.embed(author).setDescription(t('commands:autorole.reset.success')),
    );
  }
}

export default ResetAutoRoleCommand;
