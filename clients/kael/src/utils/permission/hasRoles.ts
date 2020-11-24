import { Guilds } from '@kaelbot/constants';
import { Guild, GuildMember } from 'discord.js';
import { container } from 'tsyringe';

import { Namespace } from '@config/containers';

import { Client } from '@interfaces';

async function hasRoles(
  userId: string,
  { roles: defaultRoles = [], guilds: defaultGuilds = [Guilds.Official] }: Data,
): Promise<boolean[]> {
  const client = container.resolve<Client>(Namespace.Client);

  const roles: string[] = [].concat(defaultRoles as any);
  const guilds = []
    .concat(defaultGuilds as any)
    .map(guild => client.guilds.cache.get(guild))
    .filter(Boolean) as Guild[];

  if (!roles.length) return [];
  if (!guilds.length) return roles.map(() => false);

  const guildsWithMember = (await Promise.all(
    guilds.map(guild => guild.members.fetch(userId).catch(() => null)),
  ).then(allGuilds => allGuilds.filter(Boolean))) as GuildMember[];

  if (!guildsWithMember.length) {
    return roles.map(() => false);
  }

  return roles.map(currentRoles =>
    guildsWithMember.some(member =>
      [].concat(currentRoles as any).some(role => member.roles.cache.has(role)),
    ),
  );
}

interface Data {
  guilds: string | string[];
  roles: string | string[] | (string | string[])[];
}

export default hasRoles;
