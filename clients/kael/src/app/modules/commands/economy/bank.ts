import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'bank',
  category: 'economy',
  aliases: ['banco'],
  tools: {
    guildOnly: true,
  },
})
class BankCommand extends CommandStructure {
  constructor() {
    super();
  }

  public execute({ t, document, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail('Kael.Card')
        .setAuthor(
          t('commands:bank.author', { guild: guild.name }),
          guild.iconURL() || undefined,
        )
        .setDescription(
          t('commands:bank.description', {
            koins: document.social.bank.toLocaleString(),
          }),
        ),
    );
  }
}

export default BankCommand;
