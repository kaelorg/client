import CountHelper from '@clients/manager/build/helpers/CountHelper';
import { inject, injectable } from 'tsyringe';

import StringArgument from '@app/arguments/StringArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'model',
  category: 'system',
  reference: 'count',
  aliases: ['modelo'],
  arguments: [new StringArgument()],
})
class ModelCountCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    model: string,
  ) {
    const countModel = CountHelper.findModel(model, false);

    if (!countModel) {
      channel.error(author, t('commands:count.model.noModel'));
      return;
    }

    await this.client.database.guilds.update(guild.id, {
      'count.type': countModel.id,
    });

    channel.send(
      this.embed(author).setDescription(
        t('commands:count.model.success', { model: countModel.description }),
      ),
    );
  }
}

export default ModelCountCommand;
