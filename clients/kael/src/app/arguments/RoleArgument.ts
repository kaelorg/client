import { Role } from 'discord.js';

import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class RoleArgument extends ArgumentStructure {
  get defaultOptions(): AllPartial<ArgumentOptions> {
    return {
      missingError: 'errors:missingRole',
    };
  }

  public execute(
    { argument }: ArgumentExecuteData,
    { t, guild }: CommandExecuteData,
  ): Role {
    const id = argument.replace(/(<|@|&|>)/g, '');

    if (!/^([0-9]{18})$/.test(id) || !guild.roles.cache.has(id)) {
      throw new ArgumentError(t('errors:missingValidRole'));
    }

    return guild.roles.cache.get(id) as Role;
  }
}

export default RoleArgument;
