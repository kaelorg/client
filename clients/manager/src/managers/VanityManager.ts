import { GuildUserVanity } from '@kaelbot/database';
import Timeout from '@packages/timeout';

import BaseManager from './BaseManager';

class VanityManager extends BaseManager {
  private readonly addQueue: VanityAddItem[] = [];

  private readonly removeQueue: VanityRemoveItem[] = [];

  private readonly timeouts = new Map<string, Timeout>();

  protected readonly subscription = this.socket.subscribe('vanity');

  protected async init(): Promise<void> {
    this.subscription.on('add', data => this.handle('add', data));
    this.subscription.on('remove', data => this.handle('remove', data));

    await this.retrieve();
    setInterval(() => this.checkQueue(), 60000);
  }

  private clientHasGuild(guildId: string): boolean {
    return this.client.ws.shards.some(shard => {
      const expectedGuilds = (<any>shard).expectedGuilds as Set<string> | null;

      return !!(expectedGuilds && expectedGuilds.has(guildId));
    });
  }

  private parseTimeoutKey({
    guild_id,
    member_id,
  }: Pick<VanityData, 'guild_id' | 'member_id'>): string {
    return `${guild_id}_${member_id}`;
  }

  private async hasInDatabase({
    guild_id,
    member_id,
  }: Pick<VanityData, 'guild_id' | 'member_id'>): Promise<boolean> {
    const { vanity } = await this.client.database.guilds.findOne(guild_id);

    return vanity.users.some(({ id }) => id === member_id);
  }

  private checkQueue(): void {
    if (this.addQueue.length) {
      this.add(this.addQueue.shift() as VanityAddItem);
    }

    if (this.removeQueue.length) {
      this.remove(this.removeQueue.shift() as VanityRemoveItem);
    }

    if (this.addQueue.length || this.removeQueue.length) {
      this.checkQueue();
    }
  }

  private async retrieve(): Promise<void> {
    const query = { 'vanity.users.0': { $exists: true } };
    const guilds = await this.database.guilds.findAll(query);

    const items = guilds.flatMap(guild =>
      guild.vanity.users.map(
        ({ id, time, role, added_by, timestamp }): VanityAddItem => ({
          added_by,
          timestamp,
          role_id: role,
          member_id: id,
          time: time as any,
          guild_id: guild._id as string,
        }),
      ),
    );

    this.addQueue.push(...items);
    this.checkQueue();
  }

  private handle(
    type: VanityTypes,
    {
      time,
      role_id,
      guild_id,
      added_by,
      member_id,
      timestamp = Date.now(),
    }: VanityData,
  ): void {
    const data = {
      time,
      role_id,
      guild_id,
      added_by,
      member_id,
      timestamp,
    };

    switch (type) {
      case 'add':
        this.add(data as VanityAddItem);
        break;
      case 'remove':
        this.remove(data);
        break;
      default:
    }
  }

  // Handlers

  private async remove(item: VanityRemoveItem): Promise<void> {
    const timeoutKey = this.parseTimeoutKey(item);
    const timeout = this.timeouts.get(timeoutKey);

    if (timeout) {
      timeout.delete();
      this.timeouts.delete(timeoutKey);
    }

    const hasInDatabase = await this.hasInDatabase(item);

    if (!hasInDatabase) return;

    const { guild_id, member_id } = item;
    const guild = this.client.guilds.cache.get(guild_id);

    if (!guild) {
      if (this.clientHasGuild(guild_id)) this.removeQueue.push(item);
      return;
    }

    try {
      const member = await guild.members.fetch(member_id);
      const { role } = await this.client.database.guilds
        .findOne(guild_id)
        .then(
          ({ vanity }) =>
            vanity.users.find(({ id }) => id === member_id) as GuildUserVanity,
        );

      if (member.roles.cache.has(role)) {
        await member.roles.remove(role);
      }
    } finally {
      await this.database.guilds
        .update(guild_id, { $pull: { 'vanity.users': { id: member_id } } })
        .catch(() => {
          // void
        });
    }
  }

  private async add(item: VanityAddItem): Promise<void> {
    const { time, role_id, guild_id, member_id, added_by, timestamp } = item;

    if (
      this.timeouts.has(this.parseTimeoutKey(item)) ||
      this.addQueue.some(
        ({ guild_id: queueGuildId, member_id: queueMemberId }) =>
          queueGuildId === guild_id && queueMemberId === member_id,
      )
    ) {
      return;
    }

    try {
      const hasInDatabase = await this.hasInDatabase(item);

      if (!hasInDatabase) {
        await this.database.guilds.update(guild_id, {
          $push: {
            'vanity.users': {
              added_by,
              timestamp,
              role: role_id,
              id: member_id,
              time: time as any,
            } as GuildUserVanity,
          },
        });
      }

      const guild = this.client.guilds.cache.get(guild_id);

      if (!guild) {
        if (this.clientHasGuild(guild_id)) {
          this.addQueue.push(item);
          return;
        }

        throw new Error('GUILD_INVALID');
      }

      const member = await guild.members.fetch(member_id);

      if (!member) throw new Error('MEMBER_INVALID');
      if (!member.roles.cache.has(role_id)) {
        await member.roles.add(role_id);
      }

      this.timeouts.set(
        this.parseTimeoutKey(item),
        new Timeout(() => this.remove(item), time - (Date.now() - timestamp)),
      );
    } catch {
      this.remove(item);
    }
  }
}

type VanityTypes = 'add' | 'remove';

type VanityRemoveItem = Pick<VanityData, 'guild_id' | 'member_id'>;

interface VanityAddItem extends Required<Omit<VanityData, 'added_by'>> {
  added_by?: VanityData['added_by'];
}

interface VanityData {
  time?: number;
  role_id?: string;
  guild_id: string;
  member_id: string;
  added_by?: string;
  timestamp?: number;
}

export default VanityManager;
