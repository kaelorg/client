import { GuildMember } from 'discord.js';

interface Type {
  name: string;
  execute(member: GuildMember, roles: string[]): Promise<void>;
  makeFilter(roles: string[]): (member: GuildMember) => boolean;
}

export default Type;
