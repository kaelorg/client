import { GuildMember } from 'discord.js';

import Type from './Type';

class RemoveType implements Type {
  get name(): string {
    return 'remove';
  }

  public makeFilter(roles: string[]) {
    return (member: GuildMember) =>
      roles.some(role => member.roles.cache.has(role));
  }

  public async execute(member: GuildMember, roles: string[]): Promise<void> {
    if (roles.every(role => !member.roles.cache.has(role))) {
      throw new Error('USER NOTE_HAVE_ROLES');
    }

    await member.roles.remove(roles).catch(() => {
      // void
    });
  }
}

export default RemoveType;
