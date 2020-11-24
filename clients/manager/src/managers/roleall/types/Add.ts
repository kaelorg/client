import { GuildMember } from 'discord.js';

import Type from './Type';

class AddType implements Type {
  get name(): string {
    return 'add';
  }

  public makeFilter(roles: string[]) {
    return (member: GuildMember) =>
      roles.some(role => !member.roles.cache.has(role));
  }

  public async execute(member: GuildMember, roles: string[]): Promise<void> {
    if (roles.every(role => member.roles.cache.has(role))) {
      throw new Error('USER ALREADY_HAS_ROLES');
    }

    await member.roles.add(roles).catch(() => {
      // void
    });
  }
}

export default AddType;
