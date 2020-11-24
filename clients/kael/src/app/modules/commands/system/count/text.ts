import { inject, injectable } from 'tsyringe';

import StringArgument from '@app/arguments/StringArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'text',
  category: 'system',
  reference: 'count',
  aliases: ['texto'],
  arguments: [
    new StringArgument({
      missingError: 'commands:count.text.missingText',
      maxLength: 100,
    }),
  ],
})
class TextCountCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    text: string,
  ) {
    await this.client.database.guilds.update(guild.id, { 'count.text': text });

    channel.send(
      this.embed(author).setDescription(
        t('commands:count.text.success', { text }),
      ),
    );
  }
}

export default TextCountCommand;
