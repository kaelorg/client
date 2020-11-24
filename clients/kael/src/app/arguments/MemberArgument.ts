import { GuildMember } from 'discord.js';

import ArgumentError from '@core/errors/ArgumentError';
import ArgumentStructure from '@core/structures/abstract/ArgumentStructure';

import {
  ArgumentOptions,
  CommandExecuteData,
  ArgumentExecuteData,
} from '@interfaces';

class MemberArgument extends ArgumentStructure<Options> {
  get defaultOptions(): AllPartial<ArgumentOptions<Options>> {
    return {
      missingError: 'errors:missingMember',
      acceptBot: true,
      acceptSelf: true,
    };
  }

  public async execute(
    { argument }: ArgumentExecuteData,
    { t, author, guild }: CommandExecuteData,
  ): Promise<GuildMember> {
    const id = argument.replace(/(<|@|!|>)/g, '');
    const isId = /^([0-9]{18})$/.test(id);

    if (!isId) throw new ArgumentError(t<string>('errors:missingValidId'));

    const member = await guild.members.fetch(id).catch(() => null);

    if (!member) throw new ArgumentError(t('errors:missingValidMember'));

    const { acceptBot, acceptSelf } = this.options;

    if (!acceptSelf && author.id === member.id) {
      throw new ArgumentError(t('errors:notAcceptSelf'));
    }

    if (!acceptBot && member.user.bot) {
      throw new ArgumentError(t('errors:notAcceptBot'));
    }

    return member;
  }
}

interface Options {
  acceptBot: boolean;
  acceptSelf: boolean;
}

export default MemberArgument;
