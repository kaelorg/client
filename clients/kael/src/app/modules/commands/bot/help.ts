import { Urls } from '@kaelbot/constants';
import { inject, injectable } from 'tsyringe';

import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { Namespace } from '@config/containers';

import { Client, CommandExecuteData } from '@interfaces';

@injectable()
@command({
  name: 'help',
  category: 'bot',
  aliases: ['ajuda', 'comandos', 'commands', 'support'],
})
class HelpCommand extends CommandStructure {
  constructor(
    @inject(Namespace.Client)
    private client: Client,
  ) {
    super();
  }

  public execute({ t, author, channel }: CommandExecuteData) {
    const clientUser = this.client.user;
    const fields = t<Field[]>('commands:help.fields', { returnObjects: true });

    channel.send(
      this.embed(author)
        .setTitle(t('commands:help.title'))
        .setThumbnail(author.displayAvatarURL())
        .setDescription(t('commands:help.description', { author }))
        .setAuthor(clientUser.username, clientUser.displayAvatarURL())
        .addFields(
          fields.map(({ name, route }) => ({
            name,
            value: `${Urls.Site}/${route}`,
          })),
        ),
    );
  }
}

interface Field {
  name: string;
  route: string;
}

export default HelpCommand;
