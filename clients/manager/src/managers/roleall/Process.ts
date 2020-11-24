import { GuildMember } from 'discord.js';

import Add from './types/Add';
import Remove from './types/Remove';
import Type from './types/Type';

class Process {
  public count: number;

  public readonly type: Type;

  public readonly roles: string[];

  public readonly guildId: string;

  public readonly data: Record<string, any>;

  constructor({ type, roles, data, guildId }: ProcessData) {
    this.count = 0;
    this.roles = roles;
    this.guildId = guildId;

    this.type = Process.makeType(type);
    this.data = Object.assign(data, { type });
  }

  public async handle(member: GuildMember): Promise<void> {
    try {
      await this.type.execute(member, this.roles);
      this.setCount();
    } catch {
      // Silent
    }
  }

  private setCount(): this {
    this.count += 1;
    return this;
  }

  public toJson() {
    return {
      count: this.count,
      roles: this.roles,
      type: this.type.name,
      guild_id: this.guildId,
    };
  }

  // Static

  public static isValidType(type: string): boolean {
    try {
      this.makeType(type);
      return true;
    } catch {
      return false;
    }
  }

  public static makeType(type: string): Type {
    switch (type) {
      case 'add':
        return new Add();
      case 'remove':
        return new Remove();
      default:
        throw new TypeError('INVALID_TYPE');
    }
  }
}

interface ProcessData {
  type: string;
  roles: string[];
  guildId: string;
  data: Record<string, any>;
}

export default Process;
