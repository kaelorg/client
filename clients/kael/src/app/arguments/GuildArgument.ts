import { Guild } from 'discord.js';
import { container } from 'tsyringe';

import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import { Namespace } from '@config/containers';

import {
  Client,
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class GuildArgument extends ArgumentStructure {
  get defaultOptions(): AllPartial<ArgumentOptions> {
    return {
      missingError: 'errors:missingGuild',
    };
  }

  public execute(
    { argument }: ArgumentExecuteData,
    { t }: CommandExecuteData,
  ): Guild {
    const client = container.resolve<Client>(Namespace.Client);
    const guild = client.guilds.cache.get(argument);

    if (!guild) throw new ArgumentError(t('errors:missingValidGuild'));
    return guild;
  }
}

export default GuildArgument;
