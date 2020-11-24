import { GuildChannel } from 'discord.js';

import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class GuildChannelArgument extends ArgumentStructure {
  get defaultOptions(): AllPartial<ArgumentOptions> {
    return {
      missingError: 'errors:missingHex',
    };
  }

  public execute(
    { argument }: ArgumentExecuteData,
    { t, guild }: CommandExecuteData,
  ): GuildChannel {
    const id = argument.replace(/(<|#|>)/g, '');

    if (!/^([0-9]{18})$/.test(id) || !guild.channels.cache.has(id)) {
      throw new ArgumentError(t('errors:missingValidChannel'));
    }

    return guild.channels.cache.get(id) as GuildChannel;
  }
}

export default GuildChannelArgument;
