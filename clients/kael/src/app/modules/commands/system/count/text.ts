import { KaelDatabase } from '@kaelbot/database';
import { inject, injectable } from 'tsyringe';

import StringArgument from '@app/arguments/StringArgument';
import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { CommandExecuteData } from '@interfaces';

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
    @inject(Namespace.Database)
    private database: KaelDatabase,
  ) {
    super();
  }

  public async execute(
    { t, author, channel, guild }: CommandExecuteData,
    text: string,
  ) {
    await this.database.guilds.update(guild.id, { 'count.text': text });

    channel.send(
      this.embed(author).setDescription(
        t('commands:count.text.success', { text }),
      ),
    );
  }
}

export default TextCountCommand;
