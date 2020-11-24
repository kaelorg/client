import command from '@app/decorators/command/command';
import CommandStructure from '@core/structures/abstract/CommandStructure';

import { CommandExecuteData } from '@interfaces';

@command({
  name: 'count',
  category: 'system',
  aliases: ['contador'],
  tools: {
    guildOnly: true,
    botPermissions: ['MANAGE_GUILD'],
    userPermissions: ['MANAGE_GUILD'],
  },
})
class CountCommand extends CommandStructure {
  public execute({ t, author, channel, guild }: CommandExecuteData) {
    channel.send(
      this.embed(author)
        .setThumbnail('Kael.Count')
        .setDescription(t('commands:count.help.description'))
        .setAuthor(
          t('commands:count.help.author'),
          guild.iconURL() || undefined,
        )
        .addField(
          t('commands:count.help.exampleTitle'),
          t('commands:count.help.exampleDesc'),
        )
        .addField(
          t('commands:count.help.textTitle'),
          t('commands:count.help:textDescription'),
        )
        .addField(
          t('commands:count.help.channelTitle'),
          t('commands:count.help:channelDescription'),
        )
        .addField(
          t('commands:count.help.modelTitle'),
          t('commands:count.help:modelDescription'),
        )
        .addField(
          t('commands:count.help.modelsTitle'),
          t('commands:count.help:modelsDescription'),
        )
        .addField(
          t('commands:count.help.resetTitle'),
          t('commands:count.help:resetDescription'),
        ),
    );
  }
}

export default CountCommand;
