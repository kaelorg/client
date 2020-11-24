import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'reset',
  category: 'system',
  reference: 'count',
  aliases: ['resetar'],
})
class ResetCountCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute({ t, author, channel, guild }: CommandExecuteData) {
    await this.client.database.guilds.update(guild.id, { count: {} });

    channel.send(
      this.embed(author).setDescription(t('commands:count.reset.success')),
    );
  }
}

export default ResetCountCommand;
