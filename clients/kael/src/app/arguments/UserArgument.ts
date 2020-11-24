import { User } from 'discord.js';
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

class UserArgument extends ArgumentStructure<Options> {
  get defaultOptions(): AllPartial<ArgumentOptions<Options>> {
    return {
      missingError: 'errors:missingUser',
    };
  }

  public async execute(
    { argument }: ArgumentExecuteData,
    { t, author, guild }: CommandExecuteData,
  ): Promise<User> {
    const id = argument.replace(/(<|@|!|>)/g, '');
    const isId = /^([0-9]{18})$/.test(id);

    if (!isId) throw new ArgumentError(t<string>('errors:missingValidId'));

    let user: User | null = null;

    if (guild) {
      const member = guild.members.cache.get(id);

      if (member) user = member.user;
    }

    if (!user) {
      const client = container.resolve<Client>(Namespace.Client);
      const fetchedUser = await client.users.fetch(id).catch(() => null);

      if (fetchedUser) user = fetchedUser;
    }

    if (!user) throw new ArgumentError(t('errors:missingValidUser'));

    const { acceptBot, acceptSelf } = this.options;

    if (!acceptSelf && author.id === user.id) {
      throw new ArgumentError(t('errors:notAcceptSelf'));
    }

    if (!acceptBot && user.bot) {
      throw new ArgumentError(t('errors:notAcceptBot'));
    }

    return user;
  }
}

interface Options {
  acceptBot: boolean;
  acceptSelf: boolean;
}

export default UserArgument;
