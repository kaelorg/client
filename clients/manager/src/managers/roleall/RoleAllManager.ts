import Loop from '@packages/loop';
import { Guild } from 'discord.js';

import BaseManager from '../BaseManager';
import Process from './Process';

const LoopDelay = 1500;

class RoleAllManager extends BaseManager {
  private readonly process = new Map<string, Process>();

  protected readonly subscription = this.socket.subscribe('role-all');

  protected init(): void {
    this.subscription.on('add', data => this.execute('add', data));
    this.subscription.on('remove', data => this.execute('remove', data));
  }

  private sendError(type: RoleAllTypes, data: RoleAllData, error: any): void {
    this.subscription.send(
      'error',
      Object.assign(data, {
        type,
        error: typeof error === 'string' ? error : 'generic',
      }),
    );
  }

  private executeProcess(guild: Guild, process: Process): void {
    const loop = new Loop(LoopDelay);

    const filter = process.type.makeFilter(process.roles);
    const allMembers = guild.members.cache.filter(filter);
    const members = allMembers.values();

    loop.start(async () => {
      const currentValue = members.next();

      if (currentValue.done) {
        loop.stop();

        this.subscription.send('success', process.toJson());
        this.process.delete(guild.id);
        return;
      }

      await process.handle(currentValue.value);
    });
  }

  private execute(type: RoleAllTypes, data: RoleAllData): void {
    const { roles, guild_id } = data;
    const guild = this.client.guilds.cache.get(guild_id);

    if (!guild) return this.sendError(type, data, 'invalid_guild');
    if (this.process.has(guild_id)) {
      return this.sendError(type, data, 'has_process');
    }
    if (!Process.isValidType(type)) {
      return this.sendError(type, data, 'invalid_type');
    }

    const process = new Process({
      type,
      data,
      roles,
      guildId: guild_id,
    });

    const success = () => {
      if (this.process.has(guild_id)) return;

      this.process.set(guild_id, process);
      this.executeProcess(guild, process);
    };

    if (guild.members.cache.size === guild.memberCount) {
      success();
      return;
    }

    guild.members.fetch({ force: true }).then(() => {
      success();
    });
  }
}

type RoleAllTypes = 'add' | 'remove';

interface RoleAllData {
  roles: string[];
  guild_id: string;
}

export default RoleAllManager;
