import {
  GuildCount,
  GuildLeaveWelcome,
  GuildInputWelcome,
} from '@kaelbot/database';
import { Guild, GuildMember, PartialGuildMember } from 'discord.js';

import CountHelper from '@helpers/CountHelper';
import MessageHelper from '@helpers/MessageHelper';

import BaseManager from './BaseManager';

class WelcomeManager extends BaseManager {
  protected init(): void {
    this.client.on('guildMemberAdd', this.onMemberAdd.bind(this));
    this.client.on('guildMemberRemove', this.onMemberRemove.bind(this));
  }

  private async onMemberRemove(
    member: GuildMember | PartialGuildMember,
  ): Promise<void> {
    const { guild } = member;
    const { count, welcome } = await this.database.guilds.findOne(guild.id);

    await this.handleWelcomeMessage(
      { guild, member: member as GuildMember },
      welcome.leave,
    );
    await this.handleCount(guild, count);
  }

  private async onMemberAdd(member: GuildMember): Promise<void> {
    const { guild } = member;
    const {
      count,
      welcome,
      auto_role: { active: autoRoleActive, roles: autoRoleRoles },
    } = await this.database.guilds.findOne(guild.id);

    await this.handleWelcomeMessage({ guild, member }, welcome.input);

    if (autoRoleActive && autoRoleRoles.length) {
      await member.roles
        .add(autoRoleRoles.filter(role => guild.roles.cache.has(role)))
        .catch(() => {});
    }

    await this.handleCount(guild, count);
  }

  private async handleCount(
    guild: Guild,
    { text, active, channel, type: model }: GuildCount,
  ): Promise<void> {
    if (!active) return;

    const countChannel = guild.channels.cache.get(channel);

    if (!countChannel) return;

    const countHelper = new CountHelper();

    await countHelper.handle(
      { text, model },
      {
        guild,
        channel: countChannel,
      },
    );
  }

  private async handleWelcomeMessage(
    { guild, member }: HandleWelcomeMessageDeps,
    { active, channel, message }: GuildLeaveWelcome | GuildInputWelcome,
  ): Promise<void> {
    if (!active) return;

    const welcomeChannel = guild.channels.cache.get(channel);

    if (!welcomeChannel) return;

    const messageHelper = new MessageHelper();

    await messageHelper.handle(message, {
      guild,
      member,
      channel: welcomeChannel,
    });
  }
}

interface HandleWelcomeMessageDeps {
  guild: Guild;
  member: GuildMember;
}

export default WelcomeManager;
